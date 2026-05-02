import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { ListTree } from "lucide-react-native";

type TocItem = {
  id: string;
  title: string;
};

type ClinicalReaderFrameProps = {
  title: string;
  subtitle?: string;
  toc?: TocItem[];
  children: ReactNode;
};

export function ClinicalReaderFrame({ title, subtitle, toc = [], children }: ClinicalReaderFrameProps) {
  return (
    <View className="flex-1 bg-ink-950">
      <View className="border-b border-border px-4 pb-4 pt-2">
        <Text className="font-heading text-[28px] leading-9 text-text-primary">{title}</Text>
        {subtitle ? <Text className="mt-2 font-body text-[15px] leading-6 text-text-secondary">{subtitle}</Text> : null}
      </View>

      <View className="flex-1 flex-row">
        <ScrollView className="flex-1 px-4" contentContainerClassName="pb-32 pt-5">
          {children}
        </ScrollView>

        {toc.length > 0 ? (
          <View className="absolute bottom-6 right-4 max-w-[210px] rounded-clinical border border-border bg-ink-800/95 p-3">
            <View className="mb-2 flex-row items-center gap-2">
              <ListTree size={15} color="#B8FFD2" strokeWidth={1.6} />
              <Text className="font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-muted">Contents</Text>
            </View>
            {toc.slice(0, 6).map((item) => (
              <Text key={item.id} numberOfLines={1} className="py-1 font-bodySemi text-[12px] text-text-secondary">
                {item.title}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function ReaderDoseBlock({ label, value, warning }: { label: string; value: string; warning?: string }) {
  return (
    <View className="my-3 rounded-clinical border border-border bg-ink-800 p-4">
      <Text className="font-bodySemi text-[11px] uppercase tracking-[1.4px] text-text-muted">{label}</Text>
      <Text className="mt-2 font-heading text-[30px] leading-9 text-mint">{value}</Text>
      {warning ? <Text className="mt-3 font-bodySemi text-[14px] leading-5 text-clinical-red">{warning}</Text> : null}
    </View>
  );
}
