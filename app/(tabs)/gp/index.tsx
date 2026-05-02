import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  Heart, Wind, Activity, Brain, Microscope,
  Baby, FlaskConical, Stethoscope, Syringe, User2,
  BookOpen, Trophy, ChevronRight,
} from "lucide-react";
import { router } from "expo-router";
import { useDatabase } from "@/db/provider";
import { systems, conditions } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { PremiumMedicineCard } from "@/components/cards/PremiumMedicineCard";
import { ProtocolChecklistCard } from "@/components/cards/ProtocolChecklistCard";
import { BentoGridHome } from "@/components/dashboard/bento-grid-home";
import { AIAssistantButton } from "@/components/ai/ai-assistant-button";
import { OmniSearchCockpit } from "@/components/search/omni-search-cockpit";
import { logCase } from "@/lib/surveillance";
import { getTotalCases } from "@/lib/surveillance";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { useEffect, useState } from "react";

const ICONS: Record<string, any> = {
  Heart, Wind, Activity, Brain, Microscope,
  Baby, FlaskConical, Stethoscope, Syringe, User2,
};

export default function GPMasterScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAI, setShowAI] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <BentoGridHome navigation={router} />
      
      {/* Omni-Search Cockpit */}
      <OmniSearchCockpit
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={(result) => {
          console.log('Selected:', result);
        }}
      />
      
      {/* AI Assistant Button */}
      <AIAssistantButton
        visible={true}
        onPress={() => {
          console.log('AI Assistant pressed');
        }}
        onChatToggle={(isOpen) => {
          setShowAI(isOpen);
        }}
      />
    </View>
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
