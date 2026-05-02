import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import {
  Heart, Wind, Activity, Brain, Microscope,
  Baby, FlaskConical, Stethoscope, Syringe, User2,
  BookOpen, Trophy, ChevronRight,
} from "lucide-react-native";
import { useDatabase } from "@/db/provider";
import { useEffect, useState } from "react";
import { systems, conditions } from "@/db/schema";
import { getTotalCases } from "@/lib/surveillance";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

const ICONS: Record<string, any> = {
  Heart, Wind, Activity, Brain, Microscope,
  Baby, FlaskConical, Stethoscope, Syringe, User2,
};

export default function GPMasterScreen() {
  const { db } = useDatabase();
  const [sysList, setSysList] = useState<any[]>([]);
  const [condCount, setCondCount] = useState(0);
  const [totalCases, setTotalCases] = useState(0);

  useEffect(() => {
    if (!db) return;
    db.select().from(systems).then(setSysList);
    db.select().from(conditions).then((r) => setCondCount(r.length));
    getTotalCases().then(setTotalCases);
  }, [db]);

  return (
    <ClinicalShell padded={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 112 }}>
        <View className="mb-5">
          <Text className="font-heading text-[30px] leading-[38px] text-text-primary">GP Master</Text>
          <Text className="mt-1 font-body text-[13px] text-text-muted">Clinical protocols optimized for one-handed rounds</Text>
        </View>

        <View className="mb-6 flex-row gap-3">
          <StatCard label="Conditions" value={condCount} icon={<BookOpen size={16} color="#B8FFD2" strokeWidth={1.6} />} />
          <StatCard label="Cases Logged" value={totalCases} icon={<Activity size={16} color="#00D7B5" strokeWidth={1.6} />} />
        </View>

        <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.7px] text-text-muted">Medical Systems</Text>

        <View className="flex-row flex-wrap gap-3">
          {sysList.map((sys, index) => {
            const Icon = ICONS[sys.icon] ?? Stethoscope;
            const wide = index === 0 || index === 3;
            return (
              <TouchableOpacity
                key={sys.id}
                onPress={() => {
                  triggerSelectionHaptic();
                  router.push(`/gp/${sys.id}` as any);
                }}
                className="rounded-clinical border border-border bg-ink-800 p-4"
                style={{ width: wide ? "100%" : "47%", minHeight: wide ? 112 : 148 }}
                activeOpacity={0.78}
              >
                <View className="mb-4 h-12 w-12 items-center justify-center rounded-[20px] border border-border-soft bg-ink-700">
                  <Icon size={24} color={sys.color || "#B8FFD2"} strokeWidth={1.5} />
                </View>
                <View className="mt-auto flex-row items-end justify-between gap-3">
                  <Text className="flex-1 font-headingBold text-[17px] leading-6 text-text-primary">{sys.name}</Text>
                  <ChevronRight size={18} color="#7A7A80" strokeWidth={1.5} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.push("/gp/quiz" as any);
          }}
          className="mt-6 flex-row items-center rounded-clinical border border-border-mint bg-mint-soft p-4"
          activeOpacity={0.78}
        >
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-[18px] border border-border-mint bg-ink-950">
            <Trophy size={19} color="#B8FFD2" strokeWidth={1.6} />
          </View>
          <View className="flex-1">
            <Text className="font-headingBold text-[16px] text-mint">Medi-Quiz</Text>
            <Text className="mt-0.5 font-body text-[12px] text-text-secondary">Test your clinical knowledge</Text>
          </View>
          <ChevronRight size={18} color="#B8FFD2" strokeWidth={1.5} />
        </TouchableOpacity>
      </ScrollView>
    </ClinicalShell>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <View className="flex-1 rounded-clinical border border-border bg-ink-800 p-4">
      <View className="mb-2 flex-row items-center gap-2">
        {icon}
        <Text className="font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-muted">{label}</Text>
      </View>
      <Text className="font-heading text-[30px] leading-9 text-text-primary">{value}</Text>
    </View>
  );
}
