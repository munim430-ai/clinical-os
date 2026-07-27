import { useDatabase } from "@/db/provider";
import { doctorProfile } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type DoctorProfile = typeof doctorProfile.$inferSelect;

const TEMPLATES = [
  { key: "default", label: "Default" },
  { key: "minimal", label: "Minimal" },
  { key: "classic", label: "Classic" },
];

export default function LetterheadStudioScreen() {
  const { db } = useDatabase();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [chamberLine1, setChamberLine1] = useState("");
  const [chamberLine2, setChamberLine2] = useState("");
  const [template, setTemplate] = useState("default");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.select()
      .from(doctorProfile)
      .limit(1)

      .then((rows) => {
        const p = rows[0];
        if (!p) return;
        setDoctor(p);
        setChamberLine1(p.chamberLine1 ?? "");
        setChamberLine2(p.chamberLine2 ?? "");
        setTemplate(p.letterheadTemplate ?? "default");
      });
  }, [db]);

  async function handleSave() {
    if (!db || saving) return;
    setSaving(true);
    try {
      const existing = await db
        .select({ id: doctorProfile.id })
        .from(doctorProfile)
        .limit(1)
        .all();
      const values = {
        chamberLine1: chamberLine1.trim(),
        chamberLine2: chamberLine2.trim(),
        letterheadTemplate: template,
        updatedAt: new Date().toISOString(),
      };
      if (existing.length) {
        await db
          .update(doctorProfile)
          .set(values)
          .where(eq(doctorProfile.id, existing[0].id));
      } else {
        await db.insert(doctorProfile).values({ id: 1, ...values });
      }
      triggerSuccessHaptic();
      router.back();
    } finally {
      setSaving(false);
    }
  }

  const doctorName = doctor?.name?.trim()
    ? `Dr. ${doctor.name}`
    : "Dr. ______________";

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
          Letterhead Studio
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Live Preview
        </Text>
        <View
          className="mb-6 rounded-clinical p-5"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <View className="flex-row items-center gap-3">
            {doctor?.logoImageUri ? (
              <Image
                source={{ uri: doctor.logoImageUri }}
                style={{ width: 44, height: 44, borderRadius: 8 }}
              />
            ) : (
              <View className="h-11 w-11 rounded-lg bg-black/5" />
            )}
            <View>
              <Text
                style={{
                  color: "#111",
                  fontFamily: "Inter_700Bold",
                  fontSize: 15,
                }}
              >
                {doctorName}
              </Text>
              {doctor?.qualifications ? (
                <Text style={{ color: "#555", fontSize: 11 }}>
                  {doctor.qualifications}
                </Text>
              ) : null}
              {doctor?.specialty || doctor?.bmdcReg ? (
                <Text style={{ color: "#555", fontSize: 11 }}>
                  {[
                    doctor?.specialty,
                    doctor?.bmdcReg ? `BM&DC: ${doctor.bmdcReg}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              ) : null}
            </View>
          </View>
          <View
            style={{ height: 1, backgroundColor: "#ddd", marginVertical: 10 }}
          />
          <Text style={{ color: "#555", fontSize: 11 }}>
            {chamberLine1 || "Chamber address"}
          </Text>
          <Text style={{ color: "#555", fontSize: 11 }}>
            {chamberLine2 || "Schedule"}
          </Text>
          {doctor?.signatureImageUri ? (
            <Image
              source={{ uri: doctor.signatureImageUri }}
              style={{
                width: 80,
                height: 32,
                marginTop: 12,
                alignSelf: "flex-end",
              }}
              resizeMode="contain"
            />
          ) : null}
        </View>

        <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Template
        </Text>
        <View className="mb-5 flex-row gap-2">
          {TEMPLATES.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => {
                triggerSelectionHaptic();
                setTemplate(t.key);
              }}
              className={cn(
                "flex-1 items-center rounded-xl border py-2.5",
                template === t.key
                  ? "border-accent-primary bg-accent-primarySoft"
                  : "border-border bg-surface",
              )}
            >
              <Text
                className={cn(
                  "font-bodySemi text-[12.5px]",
                  template === t.key
                    ? "text-accent-primary"
                    : "text-text-secondary",
                )}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="mb-1.5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Chamber Address Line 1
        </Text>
        <TextInput
          value={chamberLine1}
          onChangeText={setChamberLine1}
          placeholder="Mirpur Road, Dhaka-1216"
          placeholderTextColor="#4A4A4F"
          className="mb-4 rounded-xl border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-text-primary"
        />
        <Text className="mb-1.5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Chamber Address Line 2
        </Text>
        <TextInput
          value={chamberLine2}
          onChangeText={setChamberLine2}
          placeholder="Sat-Thu 6-9 PM"
          placeholderTextColor="#4A4A4F"
          className="mb-4 rounded-xl border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-text-primary"
        />

        <TouchableOpacity
          disabled={saving}
          onPress={handleSave}
          className="mt-2 items-center rounded-2xl bg-accent-primary py-4"
        >
          <Text className="font-bodySemi text-[15px] text-text-inverse">
            {saving ? "Saving…" : "Save Letterhead"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
