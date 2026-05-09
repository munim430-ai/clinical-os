import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import { manufacturers, medicines } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { sql } from "drizzle-orm";
import { router } from "expo-router";
import { ArrowLeft, Building2, Search, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CompanyRow = {
  id: number;
  name: string;
  brandCount: number;
};

export default function CompaniesScreen() {
  const { db } = useDatabase();
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    db.select({
      id: manufacturers.id,
      name: manufacturers.name,
      brandCount: sql<number>`count(${medicines.id})`,
    })
      .from(manufacturers)
      .leftJoin(
        medicines,
        sql`${medicines.manufacturerId} = ${manufacturers.id}`,
      )
      .groupBy(manufacturers.id)
      .orderBy(sql`count(${medicines.id}) desc`)
      .then((rows) => {
        setCompanies(rows as CompanyRow[]);
        setLoading(false);
      });
  }, [db]);

  const filtered = useMemo(() => {
    if (!query.trim()) return companies;
    const q = query.trim().toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, query]);

  return (
    <ClinicalShell>
      <View className="mb-4 flex-row items-center pt-2">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}
          className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface"
        >
          <ArrowLeft size={21} color="#2470FF" strokeWidth={1.7} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-heading text-[28px] leading-9 text-text-primary">
            Companies
          </Text>
          <Text className="font-body text-[12px] text-text-tertiary">
            {companies.length} manufacturers
          </Text>
        </View>
      </View>

      <View className="mb-4 overflow-hidden rounded-[28px] border border-border bg-surface px-4">
        <View className="flex-row items-center gap-3">
          <Search
            size={18}
            color={query ? "#2470FF" : "#8A91A8"}
            strokeWidth={1.6}
          />
          <TextInput
            className="min-h-[52px] flex-1 font-bodySemi text-[16px] text-text-primary"
            placeholder="Search manufacturers..."
            placeholderTextColor="#8A91A8"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            selectionColor="#2470FF"
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
              <X size={18} color="#8A91A8" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2470FF" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-24">
          <Text className="font-bodySemi text-[14px] text-text-tertiary">
            No companies matching "{query}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 104 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <CompanyCard
              company={item}
              onPress={() => router.push(`/dims/companies/${item.id}` as any)}
            />
          )}
        />
      )}
    </ClinicalShell>
  );
}

function CompanyCard({
  company,
  onPress,
}: { company: CompanyRow; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        onPress();
      }}
      activeOpacity={0.78}
      className="flex-row items-center rounded-2xl border border-border bg-surface px-4 py-3"
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border border-border-soft bg-surface-muted">
        <Building2 size={18} color="#2470FF" strokeWidth={1.6} />
      </View>
      <View className="flex-1">
        <Text
          className="font-bodySemi text-[15px] text-text-primary"
          numberOfLines={1}
        >
          {company.name}
        </Text>
        <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
          {company.brandCount} brand{company.brandCount !== 1 ? "s" : ""}
        </Text>
      </View>
      <View className="rounded-pill bg-mint-soft px-3 py-1">
        <Text className="font-bodySemi text-[12px] text-mint">
          {company.brandCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
