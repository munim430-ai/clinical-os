import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { useDatabase } from "@/db/provider";
import { osceCards } from "@/db/schema";
import { MMKV } from "react-native-mmkv";

const store = new MMKV({ id: "clinical-os" });

type Phase = "menu" | "quiz" | "result";

export default function QuizScreen() {
  const { db } = useDatabase();
  const [phase, setPhase] = useState<Phase>("menu");
  const [cards, setCards] = useState<any[]>([]);
  const [shuffled, setShuffled] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [bestScore, setBestScore] = useState(store.getNumber("quiz_best") ?? 0);

  useEffect(() => {
    if (!db) return;
    db.select().from(osceCards).then(setCards);
  }, [db]);

  function startQuiz() {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffled(shuffledCards);
    setIdx(0); setRevealed(false); setCorrect(0);
    setPhase("quiz");
  }

  function answer(isCorrect: boolean) {
    const newCorrect = correct + (isCorrect ? 1 : 0);
    if (idx + 1 >= shuffled.length) {
      if (newCorrect > bestScore) {
        store.set("quiz_best", newCorrect);
        setBestScore(newCorrect);
      }
      setCorrect(newCorrect); setPhase("result");
    } else {
      setCorrect(newCorrect); setIdx(idx + 1); setRevealed(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-12 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => phase === "menu" ? router.back() : setPhase("menu")}
          className="mr-3 w-9 h-9 items-center justify-center">
          <ArrowLeft size={22} color="#F2F2F2" />
        </TouchableOpacity>
        <Text className="text-foreground text-xl font-bold">Medi-Quiz</Text>
      </View>

      {phase === "menu" && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="bg-card rounded-2xl border border-border p-5 mb-4 items-center">
            <Trophy size={40} color="#00C896" />
            <Text className="text-foreground text-lg font-bold mt-3">Clinical Knowledge Quiz</Text>
            <Text className="text-muted-foreground text-sm mt-1 text-center">
              {cards.length} OSCE-style questions across all conditions
            </Text>
            <View className="mt-4 bg-primary/10 rounded-xl px-4 py-2">
              <Text className="text-primary text-sm">Best score: {bestScore}/10</Text>
            </View>
          </View>
          <TouchableOpacity onPress={startQuiz}
            className="bg-primary rounded-2xl h-14 items-center justify-center"
            disabled={cards.length === 0}>
            <Text className="text-primary-foreground font-bold text-base">
              {cards.length === 0 ? "Loading..." : "Start 10-Question Quiz"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {phase === "quiz" && shuffled[idx] && (
        <View className="flex-1 px-4 pt-4">
          {/* Progress */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <View className="h-full bg-primary rounded-full"
                style={{ width: `${((idx + 1) / shuffled.length) * 100}%` }} />
            </View>
            <Text className="text-muted-foreground text-xs ml-3">{idx + 1}/{shuffled.length}</Text>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="bg-card rounded-2xl border border-border p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="bg-primary/10 rounded-lg px-2 py-0.5">
                  <Text className="text-primary text-xs capitalize">{shuffled[idx].stationType}</Text>
                </View>
              </View>
              <Text className="text-foreground text-base font-medium leading-relaxed">
                {shuffled[idx].question}
              </Text>
            </View>

            {!revealed ? (
              <TouchableOpacity onPress={() => setRevealed(true)}
                className="bg-primary/10 border border-primary/30 rounded-2xl h-14 items-center justify-center">
                <Text className="text-primary font-semibold">Reveal Answer</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View className="bg-card rounded-2xl border border-border p-5 mb-4">
                  <Text className="text-primary text-xs font-semibold mb-2 uppercase tracking-wider">Answer</Text>
                  <Text className="text-foreground text-sm leading-relaxed">{shuffled[idx].answer}</Text>
                </View>
                <Text className="text-muted-foreground text-sm text-center mb-3">Did you get it right?</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity onPress={() => answer(false)}
                    className="flex-1 bg-red-500/10 border border-red-500/30 rounded-2xl h-12 items-center justify-center">
                    <Text className="text-red-400 font-semibold">✗ Missed it</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => answer(true)}
                    className="flex-1 bg-primary/10 border border-primary/30 rounded-2xl h-12 items-center justify-center">
                    <Text className="text-primary font-semibold">✓ Got it!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {phase === "result" && (
        <View className="flex-1 items-center justify-center px-6">
          <Trophy size={60} color={correct >= 7 ? "#00C896" : correct >= 4 ? "#FFCC44" : "#FF4444"} />
          <Text className="text-foreground text-4xl font-bold mt-4">{correct}/10</Text>
          <Text className="text-muted-foreground text-base mt-2">
            {correct >= 8 ? "Excellent! 🎯" : correct >= 6 ? "Good work!" : correct >= 4 ? "Keep practising" : "Review the protocols"}
          </Text>
          {correct === bestScore && correct > 0 && (
            <View className="mt-3 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2">
              <Text className="text-primary text-sm">New personal best!</Text>
            </View>
          )}
          <TouchableOpacity onPress={startQuiz}
            className="mt-8 bg-primary rounded-2xl w-full h-14 items-center justify-center flex-row">
            <RotateCcw size={16} color="#000" />
            <Text className="text-primary-foreground font-bold text-base ml-2">Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} className="mt-3 w-full h-12 items-center justify-center">
            <Text className="text-muted-foreground">Back to GP Master</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
