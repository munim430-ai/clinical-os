import { ScrollView, View, Text } from "react-native";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react";

const EFFECTIVE_DATE = "2025-05-01";
const CONTACT_EMAIL = "privacy@clinicalos.app";

const SECTIONS = [
  {
    title: "What Clinical OS Is",
    body:
      "Clinical OS is an offline-first clinical reference application for medical professionals in Bangladesh. It provides GP protocols, drug information, emergency dosing tools, and medical education content. It is not a telemedicine, EHR, or patient-facing product.",
  },
  {
    title: "Data We Do NOT Collect",
    body:
      "Clinical OS does not collect, transmit, or store:\n• Patient names, IDs, or health records\n• Device identifiers, phone numbers, or email addresses\n• Location data\n• Any personally identifiable information (PII)\n\nAll clinical content browsing happens offline. No analytics SDK is embedded in the app.",
  },
  {
    title: "Anonymous Surveillance Data (Opt-in)",
    body:
      "The optional 'Sync to National Registry' feature sends aggregate disease case counts (e.g. dengue: 3, typhoid: 1) to a configured national health endpoint.\n\n• Individual case records are never sent — only totals by disease type.\n• A one-way, non-reversible 64-character hex device bucket key is generated locally. It cannot be traced back to you or your device.\n• The sync endpoint is not enabled by default; it requires the EXPO_PUBLIC_SURVEILLANCE_ENDPOINT environment variable to be set by the deploying institution.\n• You can stop syncing at any time by not tapping the sync button.\n• No patient data is included in any sync payload.",
  },
  {
    title: "Local Storage",
    body:
      "Case logs and preferences are stored only on your device using SQLite and MMKV key-value storage. This data never leaves your device except through the optional aggregate sync described above. Uninstalling the app deletes all local data.",
  },
  {
    title: "Clinical Content",
    body:
      "All clinical content (protocols, drug data, lab references) is bundled offline or fetched from institution-configured endpoints. Content is read-only from the app's perspective. Clinical OS ships only original, public-domain, government-licensed, or medically-reviewed content.",
  },
  {
    title: "Children",
    body:
      "Clinical OS is intended solely for qualified medical professionals and medical students. It is not directed at individuals under 18 years of age.",
  },
  {
    title: "Third-Party Services",
    body:
      "The base app embeds no third-party analytics, advertising, or tracking SDKs. Institutionally deployed builds may configure external content sync endpoints — those deployments are subject to the privacy policies of those institutions.",
  },
  {
    title: "Changes to This Policy",
    body:
      "Material changes to this privacy policy will be noted in the app's changelog and reflected in the effective date above. Continued use of the app after changes constitutes acceptance of the revised policy.",
  },
  {
    title: "Contact",
    body: `For privacy-related questions or data deletion requests:\n${CONTACT_EMAIL}`,
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 56 }}
      accessibilityLabel="Privacy policy"
    >
      {/* Header */}
      <View className="mb-6 flex-row items-center gap-3 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={22} color="#C8F53C" strokeWidth={1.8} />
        </TouchableOpacity>
        <Text className="font-heading text-[28px] leading-9 text-text-primary">Privacy Policy</Text>
      </View>

      <Text className="mb-6 font-body text-[13px] text-text-muted">
        Effective date: {EFFECTIVE_DATE}
      </Text>

      <View className="mb-6 rounded-clinical border border-border-accent bg-mint-soft px-4 py-3">
        <Text className="font-bodySemi text-[13px] leading-5 text-mint">
          Clinical OS is designed with privacy-first principles. We do not collect patient data or personal information.
        </Text>
      </View>

      {SECTIONS.map((section, idx) => (
        <View key={idx} className="mb-6">
          <Text className="mb-2 font-headingBold text-[16px] text-text-primary">
            {section.title}
          </Text>
          <Text className="font-body text-[13px] leading-6 text-text-secondary">
            {section.body}
          </Text>
        </View>
      ))}

      <View className="mt-2 rounded-clinical border border-border-red bg-clinical-redSoft px-4 py-3">
        <Text className="font-body text-[12px] leading-5 text-clinical-red">
          Clinical OS provides reference information only. It does not constitute medical advice, diagnosis, or treatment. All clinical decisions must be made by qualified medical professionals.
        </Text>
      </View>

      <Text className="mt-6 text-center font-body text-[11px] text-text-muted">
        Clinical OS · Free Clinical Reference · Bangladesh
      </Text>
    </ScrollView>
  );
}
