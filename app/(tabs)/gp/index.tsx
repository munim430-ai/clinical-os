import { View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { BentoGridHome } from "@/components/dashboard/bento-grid-home";
import { OmniSearchCockpit, type SearchResult } from "@/components/search/omni-search-cockpit";

export default function GPMasterScreen() {
  const [showSearch, setShowSearch] = useState(false);

  const handleSelect = (result: SearchResult) => {
    router.push(result.route as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <BentoGridHome onSearchPress={() => setShowSearch(true)} />
      <OmniSearchCockpit
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={handleSelect}
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
