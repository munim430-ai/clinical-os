import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import {
  Heart, Wind, Activity, Brain, Microscope,
  Baby, FlaskConical, Stethoscope, Syringe, User2,
  BookOpen, Trophy,
} from "lucide-react-native";
import { useDatabase } from "@/db/provider";
import { useEffect, useState } from "react";
import { systems, conditions } from "@/db/schema";
import { getTotalCases } from "@/lib/surveillance";

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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      {/* Header stats */}
      <View className="flex-row gap-3 mb-6">
        <StatCard label="Conditions" value={condCount} icon={<BookOpen size={16} color="#00C896" />} />
        <StatCard label="Cases Logged" value={totalCases} icon={<Activity size={16} color="#FF4499" />} />
      </View>

      <Text className="text-muted-foreground text-xs uppercase tracking-wider mb-3">Medical Systems</Text>

      <View className="flex-row flex-wrap gap-3">
        {sysList.map((sys) => {
          const Icon = ICONS[sys.icon] ?? Stethoscope;
          return (
            <TouchableOpacity
              key={sys.id}
              onPress={() => router.push(`/gp/${sys.id}` as any)}
              className="bg-card rounded-2xl p-4 items-center justify-center border border-border"
              style={{ width: "47%" }}
              activeOpacity={0.7}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: (sys.color || "#00C896") + "22" }}
              >
                <Icon size={24} color={sys.color || "#00C896"} />
              </View>
              <Text className="text-foreground text-sm font-medium text-center">{sys.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quiz shortcut */}
      <TouchableOpacity
        onPress={() => router.push("/gp/quiz" as any)}
        className="mt-6 bg-primary/10 border border-primary/30 rounded-2xl p-4 flex-row items-center"
        activeOpacity={0.7}
      >
        <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
          <Trophy size={18} color="#00C896" />
        </View>
        <View className="flex-1">
          <Text className="text-primary font-semibold">Medi-Quiz</Text>
          <Text className="text-muted-foreground text-xs mt-0.5">Test your clinical knowledge</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <View className="flex-1 bg-card rounded-2xl border border-border p-3">
      <View className="flex-row items-center mb-1">{icon}<Text className="text-muted-foreground text-xs ml-1.5">{label}</Text></View>
      <Text className="text-foreground text-2xl font-bold">{value}</Text>
    </View>
  );
}
