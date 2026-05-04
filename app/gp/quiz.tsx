import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Trophy, RotateCcw, Brain, GraduationCap, Stethoscope, Pill, Activity } from "lucide-react";
import { useDatabase } from "@/db/provider";
import { osceCards, conditions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MMKV } from "react-native-mmkv";
import { triggerSelectionHaptic, triggerSuccessHaptic } from "@/lib/clinical-haptics";

const store = new MMKV({ id: "clinical-os" });

type Phase = "menu" | "quiz" | "result";
type StationFilter = "all" | "history" | "examination" | "management" | "data-interpretation";

interface OSCECard {
  id: number;
  conditionId: string | null;
  conditionName: string | null;
  question: string;
  answer: string;
  stationType: string | null;
}

const STATION_META: Record<StationFilter, { label: string; icon: any; color: string }> = {
  "all":                 { label: "All stations",        icon: Brain,        color: "#C8F53C" },
  "history":             { label: "History",             icon: GraduationCap, color: "#4499FF" },
  "examination":         { label: "Examination",         icon: Stethoscope,  color: "#FFD60A" },
  "management":          { label: "Management",          icon: Pill,         color: "#C8F53C" },
  "data-interpretation": { label: "Data interpretation", icon: Activity,     color: "#E91E8C" },
};

const QUIZ_LENGTH = 10;

export default function QuizScreen() {
  const { db } = useDatabase();
  const [phase, setPhase] = useState<Phase>("menu");
  const [allCards, setAllCards] = useState<OSCECard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StationFilter>("all");
  const [shuffled, setShuffled] = useState<OSCECard[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<OSCECard[]>([]);
  const [bestScore, setBestScore] = useState(store.getNumber("quiz_best") ?? 0);

  useEffect(() => {
    if (!db) return;
    db.select({
      id: osceCards.id,
      conditionId: osceCards.conditionId,
      conditionName: conditions.name,
      question: osceCards.question,
      answer: osceCards.answer,
      stationType: osceCards.stationType,
    })
      .from(osceCards)
      .leftJoin(conditions, eq(osceCards.conditionId, conditions.id))
      .then((rows) => {
        setAllCards(rows as OSCECard[]);
        setLoading(false);
      });
  }, [db]);

  const filtered = useMemo(
    () => filter === "all" ? allCards : allCards.filter((c) => c.stationType === filter),
    [allCards, filter]
  );

  const stationCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allCards.length };
    for (const c of allCards) {
      if (c.stationType) counts[c.stationType] = (counts[c.stationType] ?? 0) + 1;
    }
    return counts;
  }, [allCards]);

  // Per-condition weak area tracker
  const weakAreas = useMemo(() => {
    const raw = store.getString("quiz_weak_areas");
    if (!raw) return {} as Record<string, number>;
    try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
  }, [phase]);

  function startQuiz() {
    triggerSelectionHaptic();
    if (filtered.length === 0) return;
    const pool = [...filtered].sort(() => Math.random() - 0.5).slice(0, Math.min(QUIZ_LENGTH, filtered.length));
    setShuffled(pool);
    setIdx(0); setRevealed(false); setCorrect(0); setMissed([]);
    setPhase("quiz");
  }

  function answer(isCorrect: boolean) {
    triggerSelectionHaptic();
    const card = shuffled[idx];
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newMissed = isCorrect ? missed : [...missed, card];

    if (!isCorrect && card.conditionName) {
      const updated = { ...weakAreas, [card.conditionName]: (weakAreas[card.conditionName] ?? 0) + 1 };
      store.set("quiz_weak_areas", JSON.stringify(updated));
    }

    if (idx + 1 >= shuffled.length) {
      if (newCorrect > bestScore) {
        store.set("quiz_best", newCorrect);
        setBestScore(newCorrect);
        triggerSuccessHaptic();
      }
      setCorrect(newCorrect); setMissed(newMissed); setPhase("result");
    } else {
      setCorrect(newCorrect); setMissed(newMissed); setIdx(idx + 1); setRevealed(false);
    }
  }

  const topWeakAreas = useMemo(() => {
    return Object.entries(weakAreas)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [weakAreas, phase]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#C8F53C" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-12 pb-3 flex-row items-center">
        <TouchableOpacity
          onPress={() => phase === "menu" ? router.back() : setPhase("menu")}
          hitSlop={12}
          accessibilityLabel={phase === "menu" ? "Back" : "Back to menu"}
          accessibilityRole="button"
        >
          <ArrowLeft size={22} color="#C8F53C" strokeWidth={1.8} />
        </TouchableOpacity>
        <Text className="ml-3 font-heading text-[24px] text-text-primary">Medi-Quiz</Text>
      </View>

      {phase === "menu" && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
          {/* Hero */}
          <View className="mb-5 rounded-clinical border border-border-accent bg-mint-soft p-5 items-center">
            <Brain size={40} color="#C8F53C" strokeWidth={1.6} />
            <Text className="mt-3 font-headingBold text-[18px] text-text-primary">Clinical Knowledge Quiz</Text>
            <Text className="mt-1 text-center font-body text-[13px] text-text-secondary">
              {allCards.length} OSCE-style questions across all conditions
            </Text>
            <View className="mt-4 flex-row gap-3">
              <View className="rounded-pill bg-ink-800 px-3 py-1">
                <Text className="font-bodySemi text-[11px] text-mint">Best: {bestScore}/{QUIZ_LENGTH}</Text>
              </View>
            </View>
          </View>

          {/* Station filter */}
          <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-muted">Station type</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {(Object.keys(STATION_META) as StationFilter[]).map((key) => {
              const meta = STATION_META[key];
              const count = stationCounts[key] ?? 0;
              const active = filter === key;
              const Icon = meta.icon;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => { triggerSelectionHaptic(); setFilter(key); }}
                  className={[
                    "flex-row items-center gap-1.5 rounded-pill border px-3 py-2",
                    active ? "border-border-accent bg-mint-soft" : "border-border bg-ink-800",
                  ].join(" ")}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Icon size={13} color={active ? meta.color : "#7A7A80"} strokeWidth={1.7} />
                  <Text className={[
                    "font-bodySemi text-[12px]",
                    active ? "text-mint" : "text-text-secondary",
                  ].join(" ")}>
                    {meta.label}
                  </Text>
                  <Text className={["font-body text-[11px]", active ? "text-mint" : "text-text-muted"].join(" ")}>
                    {count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Weak areas */}
          {topWeakAreas.length > 0 ? (
            <View className="mb-5 rounded-clinical border border-border bg-ink-800 p-4">
              <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-muted">Weak areas</Text>
              {topWeakAreas.map(([name, count]) => (
                <View key={name} className="flex-row items-center justify-between py-1.5">
                  <Text className="flex-1 font-body text-[13px] text-text-secondary">{name}</Text>
                  <View className="rounded-lg bg-clinical-redSoft px-2 py-0.5">
                    <Text className="font-bodySemi text-[11px] text-clinical-red">{count} miss{count !== 1 ? "es" : ""}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {/* Start button */}
          <TouchableOpacity
            onPress={startQuiz}
            disabled={filtered.length === 0}
            className={[
              "h-14 items-center justify-center rounded-clinical",
              filtered.length === 0 ? "bg-ink-700 border border-border" : "bg-mint",
            ].join(" ")}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Start quiz with ${Math.min(QUIZ_LENGTH, filtered.length)} questions`}
          >
            <Text className={[
              "font-headingBold text-[15px]",
              filtered.length === 0 ? "text-text-muted" : "text-text-inverse",
            ].join(" ")}>
              {filtered.length === 0
                ? "No questions in this filter"
                : `Start ${Math.min(QUIZ_LENGTH, filtered.length)}-question quiz`}
            </Text>
          </TouchableOpacity>

          {topWeakAreas.length > 0 ? (
            <TouchableOpacity
              onPress={() => { store.delete("quiz_weak_areas"); setPhase("menu"); }}
              className="mt-3 items-center justify-center py-2"
              activeOpacity={0.7}
            >
              <Text className="font-body text-[12px] text-text-muted">Reset weak areas</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}

      {phase === "quiz" && shuffled[idx] ? (
        <View className="flex-1 px-4">
          {/* Progress */}
          <View className="mb-4 mt-2 flex-row items-center">
            <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
              <View
                className="h-full rounded-full bg-mint"
                style={{ width: `${((idx + 1) / shuffled.length) * 100}%` }}
              />
            </View>
            <Text className="ml-3 font-bodySemi text-[12px] text-text-muted">{idx + 1}/{shuffled.length}</Text>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Question card */}
            <View className="mb-4 rounded-clinical border border-border bg-ink-800 p-5">
              <View className="mb-3 flex-row items-center gap-2">
                {shuffled[idx].stationType ? (
                  <View className="rounded-pill bg-mint-soft px-2 py-0.5">
                    <Text className="font-bodySemi text-[10px] uppercase tracking-[1.2px] text-mint">
                      {shuffled[idx].stationType}
                    </Text>
                  </View>
                ) : null}
                {shuffled[idx].conditionName ? (
                  <View className="rounded-pill border border-border-soft px-2 py-0.5">
                    <Text className="font-body text-[11px] text-text-muted">{shuffled[idx].conditionName}</Text>
                  </View>
                ) : null}
              </View>
              <Text className="font-body text-[15px] leading-6 text-text-primary">
                {shuffled[idx].question}
              </Text>
            </View>

            {!revealed ? (
              <TouchableOpacity
                onPress={() => { triggerSelectionHaptic(); setRevealed(true); }}
                className="h-14 items-center justify-center rounded-clinical border border-border-accent bg-mint-soft"
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Reveal answer"
              >
                <Text className="font-bodySemi text-[14px] text-mint">Reveal answer</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View className="mb-4 rounded-clinical border border-border-accent bg-mint-soft p-5">
                  <Text className="mb-2 font-bodySemi text-[10px] uppercase tracking-[1.3px] text-mint">Answer</Text>
                  <Text className="font-body text-[14px] leading-6 text-text-primary">{shuffled[idx].answer}</Text>
                </View>
                <Text className="mb-3 text-center font-body text-[13px] text-text-muted">Did you get it right?</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => answer(false)}
                    className="h-12 flex-1 items-center justify-center rounded-clinical border border-border-red bg-clinical-redSoft"
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Mark answer as missed"
                  >
                    <Text className="font-bodySemi text-[13px] text-clinical-red">✗ Missed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => answer(true)}
                    className="h-12 flex-1 items-center justify-center rounded-clinical bg-mint"
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Mark answer as correct"
                  >
                    <Text className="font-bodySemi text-[13px] text-text-inverse">✓ Got it</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      ) : null}

      {phase === "result" && (
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 56 }}>
          <View className="items-center">
            <Trophy
              size={60}
              color={correct >= 7 ? "#C8F53C" : correct >= 4 ? "#FFD60A" : "#FF453A"}
              strokeWidth={1.5}
            />
            <Text className="mt-4 font-heading text-[40px] text-text-primary">
              {correct}/{shuffled.length}
            </Text>
            <Text className="mt-1 font-body text-[14px] text-text-muted">
              {correct >= 8 ? "Excellent!" : correct >= 6 ? "Good work!" : correct >= 4 ? "Keep practising" : "Review the protocols"}
            </Text>
            {correct === bestScore && correct > 0 ? (
              <View className="mt-3 rounded-pill border border-border-accent bg-mint-soft px-4 py-1">
                <Text className="font-bodySemi text-[12px] text-mint">New personal best</Text>
              </View>
            ) : null}
          </View>

          {missed.length > 0 ? (
            <View className="mt-8">
              <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-muted">
                Review missed ({missed.length})
              </Text>
              {missed.map((card) => (
                <View key={card.id} className="mb-3 rounded-clinical border border-border bg-ink-800 p-4">
                  {card.conditionName ? (
                    <Text className="mb-1 font-body text-[11px] uppercase tracking-[1px] text-text-muted">{card.conditionName}</Text>
                  ) : null}
                  <Text className="mb-2 font-bodySemi text-[13px] text-text-primary">{card.question}</Text>
                  <Text className="font-body text-[12px] leading-5 text-text-secondary">{card.answer}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <TouchableOpacity
            onPress={startQuiz}
            className="mt-6 h-14 flex-row items-center justify-center gap-2 rounded-clinical bg-mint"
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Try the quiz again"
          >
            <RotateCcw size={16} color="#0C0C0E" strokeWidth={1.8} />
            <Text className="font-headingBold text-[15px] text-text-inverse">Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-3 h-12 items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="font-body text-[13px] text-text-muted">Back to GP Master</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
