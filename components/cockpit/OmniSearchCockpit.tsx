import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { BlurView } from "expo-blur";
import { Search, Pill, ClipboardList, Siren, Calculator, Bookmark, Sparkles } from "lucide-react";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

type OmniSearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  category: "medicine" | "protocol" | "er" | "calculator" | "saved" | "ai";
};

type OmniSearchCockpitProps = {
  value: string;
  results?: OmniSearchResult[];
  onChangeText: (value: string) => void;
  onResultPress?: (result: OmniSearchResult) => void;
};

const categoryMeta = {
  medicine: { label: "Medicines", icon: Pill, color: "#C8F53C" },
  protocol: { label: "Protocols", icon: ClipboardList, color: "#00D7B5" },
  er: { label: "ER", icon: Siren, color: "#FF453A" },
  calculator: { label: "Calculators", icon: Calculator, color: "#64D2FF" },
  saved: { label: "Saved", icon: Bookmark, color: "#B8B8BE" },
  ai: { label: "AI Suggestions", icon: Sparkles, color: "#C8F53C" },
};

export function OmniSearchCockpit({ value, results = [], onChangeText, onResultPress }: OmniSearchCockpitProps) {
  const [focused, setFocused] = useState(false);

  const groupedResults = results.reduce<Record<OmniSearchResult["category"], OmniSearchResult[]>>(
    (acc, result) => {
      acc[result.category].push(result);
      return acc;
    },
    { medicine: [], protocol: [], er: [], calculator: [], saved: [], ai: [] },
  );

  return (
    <View pointerEvents="box-none" className="z-20">
      {focused ? <BlurView intensity={36} tint="dark" className="absolute -left-4 -right-4 -top-8 h-screen" /> : null}

      <View
        className="overflow-hidden rounded-[28px] border border-border bg-ink-800/80"
      >
        <BlurView intensity={28} tint="dark" className="px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Search size={19} color={focused ? "#C8F53C" : "#7A7A80"} strokeWidth={1.6} />
            <TextInput
              value={value}
              onChangeText={onChangeText}
              onFocus={() => {
                triggerSelectionHaptic();
                setFocused(true);
              }}
              onBlur={() => setFocused(false)}
              placeholder="Search drugs, protocols, ER doses"
              placeholderTextColor="#7A7A80"
              className="min-h-[44px] flex-1 font-bodySemi text-[16px] text-text-primary"
              selectionColor="#C8F53C"
            />
          </View>

          {focused ? (
            <View className="mt-3 max-h-[440px] gap-4 border-t border-border-soft pt-4">
              {(Object.keys(groupedResults) as OmniSearchResult["category"][]).map((category) => {
                const group = groupedResults[category];
                if (group.length === 0) return null;
                const Icon = categoryMeta[category].icon;

                return (
                  <View key={category} className="gap-2">
                    <View className="flex-row items-center gap-2">
                      <Icon size={14} color={categoryMeta[category].color} strokeWidth={1.6} />
                      <Text className="font-bodySemi text-[11px] uppercase tracking-[1.4px] text-text-muted">
                        {categoryMeta[category].label}
                      </Text>
                    </View>

                    {group.map((result) => (
                      <Pressable
                        key={result.id}
                        onPress={() => {
                          triggerSelectionHaptic();
                          onResultPress?.(result);
                        }}
                        className="rounded-2xl border border-border-soft bg-ink-950 px-3 py-3"
                      >
                        <Text className="font-bodySemi text-[14px] text-text-primary">{result.title}</Text>
                        {result.subtitle ? (
                          <Text className="mt-1 font-body text-[12px] text-text-muted">{result.subtitle}</Text>
                        ) : null}
                      </Pressable>
                    ))}
                  </View>
                );
              })}
            </View>
          ) : null}
        </BlurView>
      </View>
    </View>
  );
}
