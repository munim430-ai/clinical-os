import { useDatabase } from "@/db/provider";
import { doctorProfile } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { saveImage } from "@/lib/storage-native";
import { eq } from "drizzle-orm";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, BadgeCheck, ImagePlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const inputCls =
  "rounded-xl border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-text-primary";

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
        {label}
      </Text>
      {children}
    </View>
  );
}

export default function ProfileEditScreen() {
  const { db } = useDatabase();
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bmdcReg, setBmdcReg] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [chamberLine1, setChamberLine1] = useState("");
  const [chamberLine2, setChamberLine2] = useState("");
  const [signatureUri, setSignatureUri] = useState<string | null>(null);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.select()
      .from(doctorProfile)
      .limit(1)

      .then((rows) => {
        const p = rows[0];
        if (!p) return;
        setName(p.name ?? "");
        setQualifications(p.qualifications ?? "");
        setSpecialty(p.specialty ?? "");
        setBmdcReg(p.bmdcReg ?? "");
        setPhone(p.phone ?? "");
        setEmail(p.email ?? "");
        setChamberLine1(p.chamberLine1 ?? "");
        setChamberLine2(p.chamberLine2 ?? "");
        setSignatureUri(p.signatureImageUri ?? null);
        setLogoUri(p.logoImageUri ?? null);
      });
  }, [db]);

  async function pickImage(kind: "signature" | "logo") {
    triggerSelectionHaptic();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    if (Platform.OS === "web") {
      if (kind === "signature") setSignatureUri(asset.uri);
      else setLogoUri(asset.uri);
      return;
    }
    if (!asset.base64) return;
    const ext = asset.uri.split(".").pop() ?? "jpg";
    const path = await saveImage(`${kind}_${Date.now()}.${ext}`, asset.base64);
    if (kind === "signature") setSignatureUri(path);
    else setLogoUri(path);
  }

  async function handleSave() {
    if (!db || saving) return;
    setSaving(true);
    try {
      const values = {
        name: name.trim(),
        qualifications: qualifications.trim(),
        specialty: specialty.trim(),
        bmdcReg: bmdcReg.trim(),
        phone: phone.trim(),
        email: email.trim(),
        chamberLine1: chamberLine1.trim(),
        chamberLine2: chamberLine2.trim(),
        signatureImageUri: signatureUri,
        logoImageUri: logoUri,
        updatedAt: new Date().toISOString(),
      };
      const existing = await db
        .select({ id: doctorProfile.id })
        .from(doctorProfile)
        .limit(1)
        .all();
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
          Doctor Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Name">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor="#4A4A4F"
            className={inputCls}
          />
        </Field>
        <Field label="Qualifications">
          <TextInput
            value={qualifications}
            onChangeText={setQualifications}
            placeholder="MBBS, FCPS (Medicine)"
            placeholderTextColor="#4A4A4F"
            className={inputCls}
          />
        </Field>
        <Field label="Specialty">
          <TextInput
            value={specialty}
            onChangeText={setSpecialty}
            placeholder="General Practice"
            placeholderTextColor="#4A4A4F"
            className={inputCls}
          />
        </Field>
        <Field label="BM&DC Registration Number">
          <View className="flex-row items-center gap-2">
            <TextInput
              value={bmdcReg}
              onChangeText={setBmdcReg}
              placeholder="A-12345"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} flex-1`}
            />
            <BadgeCheck size={18} color={bmdcReg ? "#00D7B5" : "#4A4A4F"} />
          </View>
        </Field>
        <Field label="Phone">
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="01xxxxxxxxx"
            placeholderTextColor="#4A4A4F"
            keyboardType="phone-pad"
            className={inputCls}
          />
        </Field>
        <Field label="Email">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="doctor@example.com"
            placeholderTextColor="#4A4A4F"
            keyboardType="email-address"
            autoCapitalize="none"
            className={inputCls}
          />
        </Field>
        <Field label="Chamber Address Line 1">
          <TextInput
            value={chamberLine1}
            onChangeText={setChamberLine1}
            placeholder="Mirpur Road, Dhaka-1216"
            placeholderTextColor="#4A4A4F"
            className={inputCls}
          />
        </Field>
        <Field label="Chamber Address Line 2">
          <TextInput
            value={chamberLine2}
            onChangeText={setChamberLine2}
            placeholder="Sat-Thu 6-9 PM"
            placeholderTextColor="#4A4A4F"
            className={inputCls}
          />
        </Field>

        <Field label="Signature">
          <TouchableOpacity
            onPress={() => pickImage("signature")}
            className="flex-row items-center gap-3 rounded-xl border border-border bg-surface p-3.5"
          >
            {signatureUri ? (
              <Image
                source={{ uri: signatureUri }}
                style={{ width: 60, height: 40 }}
                resizeMode="contain"
              />
            ) : (
              <ImagePlus size={20} color="#7A7A80" />
            )}
            <Text className="font-bodySemi text-[13px] text-text-secondary">
              {signatureUri ? "Change signature" : "Upload signature"}
            </Text>
          </TouchableOpacity>
        </Field>

        <Field label="Logo (optional)">
          <TouchableOpacity
            onPress={() => pickImage("logo")}
            className="flex-row items-center gap-3 rounded-xl border border-border bg-surface p-3.5"
          >
            {logoUri ? (
              <Image
                source={{ uri: logoUri }}
                style={{ width: 40, height: 40, borderRadius: 8 }}
                resizeMode="contain"
              />
            ) : (
              <ImagePlus size={20} color="#7A7A80" />
            )}
            <Text className="font-bodySemi text-[13px] text-text-secondary">
              {logoUri ? "Change logo" : "Upload logo"}
            </Text>
          </TouchableOpacity>
        </Field>

        <TouchableOpacity
          disabled={saving}
          onPress={handleSave}
          className="mt-2 items-center rounded-2xl bg-accent-primary py-4"
        >
          <Text className="font-bodySemi text-[15px] text-text-inverse">
            {saving ? "Saving…" : "Save Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
