import { EmptyState } from "@/components/premium/EmptyState";
import { useDatabase } from "@/db/provider";
import { prescriptions } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { desc, like, or } from "drizzle-orm";
import { router } from "expo-router";
import { ArrowLeft, ClipboardList, Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Prescription = typeof prescriptions.$inferSelect;

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export default function PrescriptionListScreen() {
  const { db } = useDatabase();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Prescription[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!db) return;
    const term = query.trim() ? `%${query.trim()}%` : null;
    const list = term
      ? await db
          .select()
          .from(prescriptions)
          .where(
            or(
              like(prescriptions.patientName, term),
              like(prescriptions.rxNumber, term),
            ),
          )
          .orderBy(desc(prescriptions.createdAt))
          .limit(100)
      : await db
          .select()
          .from(prescriptions)
          .orderBy(desc(prescriptions.createdAt))
          .limit(100);
    setRows(list);
  }, [db, query]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}
          className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface"
        >
          <ArrowLeft size={19} color="#F5F5F7" strokeWidth={1.7} />
        </TouchableOpacity>
        <Text className="font-heading text-[19px] text-text-primary">
          Prescriptions
        </Text>
      </View>

      <View className="px-4 pb-3">
        <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5">
          <Search size={16} color="#7A7A80" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by patient or Rx number"
            placeholderTextColor="#4A4A4F"
            className="flex-1 font-body text-[13.5px] text-text-primary"
          />
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
            tintColor="#C8F53C"
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={ClipboardList}
            title="No prescriptions yet"
            subtitle="Prescriptions you save will show up here"
          />
        }
        renderItem={({ item }) => {
          const drugCount = item.medicinesJson
            ? (JSON.parse(item.medicinesJson) as unknown[]).length
            : 0;
          return (
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.push(`/prescription/${item.id}` as never);
              }}
              activeOpacity={0.75}
              className="mb-2.5 flex-row items-center justify-between rounded-clinical border border-border bg-surface p-4"
            >
              <View className="flex-1 pr-3">
                <Text className="font-bodySemi text-[14px] text-text-primary">
                  {item.patientName}
                </Text>
                <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
                  {item.rxNumber} · {drugCount} drug{drugCount !== 1 ? "s" : ""}
                </Text>
              </View>
              <Text className="font-body text-[11.5px] text-text-tertiary">
                {formatDate(item.createdAt)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
