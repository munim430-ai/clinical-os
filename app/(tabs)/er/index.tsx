import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Zap, Pill } from "lucide-react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useDatabase } from "@/db/provider";
import { erDrugs } from "@/db/schema";

export default function ERScreen() {
  const { db } = useDatabase();
  const [weight, setWeight] = useState("");
  const [drugs, setDrugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    db.select().from(erDrugs).then((rows) => { setDrugs(rows); setLoading(false); });
  }, [db]);

  const kg = parseFloat(weight) || 0;

  function calcDose(drug: any) {
    if (!drug.dosePerKg) return null;
    const dose = Math.min(kg * drug.dosePerKg, drug.maxDoseMg ?? Infinity);
    const vol = drug.concentrationMgPerMl ? dose / drug.concentrationMgPerMl : null;
    return { dose: dose.toFixed(2), vol: vol ? vol.toFixed(2) : null };
  }

  return (
    <View className="flex-1 bg-background">
      {/* Weight Input */}
      <View className="px-4 pt-6 pb-4">
        <View className="flex-row items-center mb-2">
          <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center mr-2">
            <Zap size={16} color="#FF4444" />
          </View>
          <Text className="text-foreground text-xl font-bold">ER Panic Mode</Text>
        </View>
        <Text className="text-muted-foreground text-xs mb-4">Weight-based emergency drug doses</Text>

        <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center">
          <TextInput
            className="flex-1 text-foreground text-4xl font-bold"
            placeholder="—"
            placeholderTextColor="#222"
            value={weight}
            onChangeText={(v) => setWeight(v.replace(/[^0-9.]/g, ""))}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text className="text-muted-foreground text-2xl font-light">kg</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#00C896" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {drugs.map((drug) => {
            const result = kg > 0 ? calcDose(drug) : null;
            return (
              <View key={drug.id} className="bg-card rounded-2xl border border-border p-4 mb-3">
                <View className="flex-row items-start justify-between mb-1">
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold text-base">{drug.name}</Text>
                    <Text className="text-muted-foreground text-xs mt-0.5">{drug.indication}</Text>
                  </View>
                  <View className="bg-secondary rounded-lg px-2 py-1 ml-2">
                    <Text className="text-muted-foreground text-xs">{drug.route}</Text>
                  </View>
                </View>

                {result ? (
                  <View className="mt-3 bg-primary/10 rounded-xl border border-primary/20 p-3">
                    <View className="flex-row items-center gap-3">
                      <View>
                        <Text className="text-muted-foreground text-xs">Dose</Text>
                        <Text className="text-primary text-lg font-bold">{result.dose} mg</Text>
                      </View>
                      {result.vol && (
                        <>
                          <Text className="text-border text-lg">→</Text>
                          <View>
                            <Text className="text-muted-foreground text-xs">Volume</Text>
                            <Text className="text-primary text-lg font-bold">{result.vol} mL</Text>
                          </View>
                        </>
                      )}
                    </View>
                    {drug.maxDoseMg && kg * drug.dosePerKg > drug.maxDoseMg && (
                      <Text className="text-yellow-500 text-xs mt-2">⚠ Capped at max dose ({drug.maxDoseMg} mg)</Text>
                    )}
                  </View>
                ) : (
                  <View className="mt-2 bg-muted rounded-lg p-2">
                    <Text className="text-muted-foreground text-xs">
                      {drug.dosePerKg ? `${drug.dosePerKg} mg/kg · max ${drug.maxDoseMg ?? "—"} mg` : drug.dilutionNotes}
                    </Text>
                  </View>
                )}

                {drug.warningNote && (
                  <Text className="text-yellow-500/70 text-xs mt-2 leading-relaxed">{drug.warningNote}</Text>
                )}

                {drug.dilutionNotes && drug.dosePerKg && (
                  <Text className="text-muted-foreground text-xs mt-1">{drug.dilutionNotes}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
