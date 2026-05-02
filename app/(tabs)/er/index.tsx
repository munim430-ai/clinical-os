import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Zap, Pill } from "lucide-react";
import { router } from "expo-router";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { PremiumMedicineCard } from "@/components/cards/PremiumMedicineCard";
import { ERModeDashboard } from "@/components/er/er-mode-dashboard";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { useState, useEffect } from "react";
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
    <View style={{ flex: 1 }}>
      <ERModeDashboard navigation={router} />
    </View>
  );
}
