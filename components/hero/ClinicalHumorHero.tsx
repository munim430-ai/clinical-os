import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { MotiView } from "moti";
import { Activity, ClipboardCheck, Pill, Siren, Stethoscope } from "lucide-react-native";

type ClinicalHumorHeroProps = {
  compact?: boolean;
  title?: string;
  subtitle?: string;
};

export function ClinicalHumorHero({
  compact = false,
  title = "Clinical OS",
  subtitle = "Your offline clinical cockpit for rounds.",
}: ClinicalHumorHeroProps) {
  return (
    <View className={compact ? "items-center py-5" : "items-center px-6 pb-8 pt-4"}>
      <View className={compact ? "h-[210px] w-full" : "h-[294px] w-full"}>
        <MotiView
          from={{ translateY: 0 }}
          animate={{ translateY: [-2, -10, -2] }}
          transition={{ type: "timing", duration: 2600, loop: true }}
          className="absolute top-10 h-[132px] w-[116px] items-center"
          style={{ left: "50%", marginLeft: -58 }}
        >
          <View className="h-16 w-16 rounded-[24px] border border-border bg-ink-800" />
          <View className="mt-[-4px] h-20 w-24 rounded-[28px] border border-border bg-text-primary px-3 py-4">
            <View className="h-3 w-10 rounded-pill bg-mint" />
            <View className="mt-3 h-2 w-14 rounded-pill bg-ink-700" />
            <View className="mt-2 h-2 w-10 rounded-pill bg-ink-700" />
          </View>
          <View className="mt-[-6px] h-8 w-16 rounded-b-[20px] bg-ink-700" />
        </MotiView>

        <MotiView
          from={{ rotate: "-4deg" }}
          animate={{ rotate: ["-4deg", "4deg", "-4deg"] }}
          transition={{ type: "timing", duration: 2200, loop: true }}
          className="absolute top-[112px] h-10 w-24 flex-row overflow-hidden rounded-pill border border-border"
          style={{ left: "50%", marginLeft: 8 }}
        >
          <View className="flex-1 bg-mint" />
          <View className="flex-1 bg-text-primary" />
        </MotiView>

        <FloatingIcon className="left-8 top-10" delay={0}>
          <Activity size={22} color="#00D7B5" strokeWidth={1.5} />
        </FloatingIcon>

        <FloatingIcon className="right-8 top-16" delay={200}>
          <ClipboardCheck size={22} color="#B8FFD2" strokeWidth={1.5} />
        </FloatingIcon>

        <FloatingIcon className="bottom-10 left-10" delay={400}>
          <Pill size={22} color="#B8FFD2" strokeWidth={1.5} />
        </FloatingIcon>

        <FloatingIcon className="bottom-8 right-10" delay={600}>
          <Stethoscope size={22} color="#00D7B5" strokeWidth={1.5} />
        </FloatingIcon>

        <MotiView
          from={{ scale: 1, opacity: 0.82 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.82, 1, 0.82] }}
          transition={{ type: "timing", duration: 1800, loop: true }}
          className="absolute bottom-2 flex-row items-center gap-2 rounded-pill border border-border-red bg-clinical-redSoft px-4 py-2"
          style={{ left: "50%", marginLeft: -74 }}
        >
          <Siren size={15} color="#FF453A" strokeWidth={1.7} />
          <Text className="font-bodySemi text-[11px] uppercase tracking-[1.3px] text-clinical-red">
            Do Not Panic
          </Text>
        </MotiView>
      </View>

      <Text className={compact ? "mt-1 text-center font-heading text-[24px] leading-8 text-text-primary" : "mt-2 text-center font-heading text-[32px] leading-[38px] text-text-primary"}>
        {title}
      </Text>
      <Text className={compact ? "mt-2 max-w-[280px] text-center font-body text-[13px] leading-5 text-text-secondary" : "mt-3 max-w-[320px] text-center font-body text-[15px] leading-6 text-text-secondary"}>
        {subtitle}
      </Text>
    </View>
  );
}

function FloatingIcon({ children, className, delay }: { children: ReactNode; className: string; delay: number }) {
  return (
    <MotiView
      from={{ translateY: 0, opacity: 0.72 }}
      animate={{ translateY: [0, -8, 0], opacity: [0.72, 1, 0.72] }}
      transition={{ type: "timing", duration: 2400, delay, loop: true }}
      className={`absolute h-12 w-12 items-center justify-center rounded-2xl border border-border bg-ink-800 ${className}`}
    >
      {children}
    </MotiView>
  );
}
