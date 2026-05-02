import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, FlatList,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { eq } from "drizzle-orm";
import { ArrowLeft, BookOpen, Stethoscope, FlaskConical, ClipboardList, GraduationCap } from "lucide-react-native";
import { useDatabase } from "@/db/provider";
import { conditions, symptoms, protocols, protocolSteps, examSteps, osceCards, labReferences } from "@/db/schema";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { logCase } from "@/lib/surveillance";

const TABS = [
  { key: "overview",  label: "Overview",  Icon: BookOpen },
  { key: "protocol",  label: "Protocol",  Icon: ClipboardList },
  { key: "exam",      label: "Exam",      Icon: Stethoscope },
  { key: "interpret", label: "Interpret", Icon: FlaskConical },
  { key: "osce",      label: "OSCE",      Icon: GraduationCap },
];

const LOGGABLE = ["dengue", "typhoid", "malaria", "cholera"];
const EXAM_CATS = ["inspection", "palpation", "percussion", "auscultation"];

export default function ConditionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [tab, setTab] = useState("overview");
  const [condition, setCondition] = useState<any>(null);
  const [symptomList, setSymptomList] = useState<any[]>([]);
  const [protocolList, setProtocolList] = useState<any[]>([]);
  const [stepList, setStepList] = useState<any[]>([]);
  const [examList, setExamList] = useState<any[]>([]);
  const [osceList, setOsceList] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!db || !id) return;
    Promise.all([
      db.select().from(conditions).where(eq(conditions.id, id)),
      db.select().from(symptoms).where(eq(symptoms.conditionId, id)),
      db.select().from(protocols).where(eq(protocols.conditionId, id)),
      db.select().from(examSteps).where(eq(examSteps.conditionId, id)),
      db.select().from(osceCards).where(eq(osceCards.conditionId, id)),
      db.select().from(labReferences).limit(20),
    ]).then(([cond, symp, prot, exam, osce, labsData]) => {
      setCondition(cond[0] ?? null);
      setSymptomList(symp);
      setProtocolList(prot);
      setExamList(exam);
      setOsceList(osce);
      setLabs(labsData);
      if (prot[0]) {
        db.select().from(protocolSteps)
          .where(eq(protocolSteps.protocolId, prot[0].id))
          .then(setStepList);
      }
      setLoading(false);
    });
  }, [db, id]);

  if (loading) {
    return <View className="flex-1 bg-background items-center justify-center"><ActivityIndicator color="#00C896" /></View>;
  }
  if (!condition) {
    return <View className="flex-1 bg-background items-center justify-center"><Text className="text-muted-foreground">Not found</Text></View>;
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-12 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 w-9 h-9 items-center justify-center">
          <ArrowLeft size={22} color="#F2F2F2" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-foreground text-lg font-bold" numberOfLines={1}>{condition.name}</Text>
          {condition.icd10Code && <Text className="text-muted-foreground text-xs">ICD-10: {condition.icd10Code}</Text>}
        </View>
        {LOGGABLE.includes(id) && (
          <TouchableOpacity
            onPress={() => { if (!loggedRef.current) { logCase(id as any); loggedRef.current = true; } }}
            className="bg-primary/20 border border-primary/40 rounded-xl px-3 py-1.5"
          >
            <Text className="text-primary text-xs font-medium">Log Case</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        className="border-b border-border" contentContainerStyle={{ paddingHorizontal: 12 }}>
        {TABS.map(({ key, label, Icon }) => (
          <TouchableOpacity key={key} onPress={() => setTab(key)}
            className="flex-row items-center px-3 py-3 mr-1"
            style={{ borderBottomWidth: 2, borderBottomColor: tab === key ? "#00C896" : "transparent" }}>
            <Icon size={14} color={tab === key ? "#00C896" : "#555"} />
            <Text style={{ color: tab === key ? "#00C896" : "#555", fontSize: 13, marginLeft: 4, fontWeight: tab === key ? "600" : "400" }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <Disclaimer />

        {tab === "overview" && (
          <View className="px-4">
            <Text className="text-foreground text-sm leading-relaxed mb-4">{condition.overview}</Text>

            {symptomList.filter(s => !s.isWarnSign).length > 0 && (
              <Section title="Symptoms & Signs">
                {symptomList.filter(s => !s.isWarnSign).map((s, i) => (
                  <BulletRow key={i} text={s.text} />
                ))}
              </Section>
            )}

            {symptomList.filter(s => s.isWarnSign).length > 0 && (
              <Section title="⚠️ Warning Signs" accent>
                {symptomList.filter(s => s.isWarnSign).map((s, i) => (
                  <BulletRow key={i} text={s.text} warn />
                ))}
              </Section>
            )}
          </View>
        )}

        {tab === "protocol" && (
          <View className="px-4">
            {protocolList[0] && (
              <View className="mb-3 flex-row items-center gap-2">
                <View className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
                  <Text className="text-primary text-xs">{protocolList[0].source} · {protocolList[0].version}</Text>
                </View>
              </View>
            )}
            {stepList.length === 0 ? (
              <Text className="text-muted-foreground text-sm">Protocol content coming soon.</Text>
            ) : (
              stepList.map((step) => <ProtocolStepCard key={step.id} step={step} />)
            )}
          </View>
        )}

        {tab === "exam" && (
          <View className="px-4">
            {examList.length === 0 ? (
              <Text className="text-muted-foreground text-sm">Exam content coming soon.</Text>
            ) : (
              EXAM_CATS.map((cat) => {
                const catSteps = examList.filter(e => e.category === cat);
                if (!catSteps.length) return null;
                return (
                  <Section key={cat} title={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                    {catSteps.map((s, i) => <BulletRow key={i} text={s.text} />)}
                  </Section>
                );
              })
            )}
            {examList.length === 0 && (
              <IPPAPlaceholder />
            )}
          </View>
        )}

        {tab === "interpret" && (
          <View className="px-4">
            <Text className="text-foreground font-semibold mb-3">Lab Reference Ranges</Text>
            {labs.map((lab) => (
              <View key={lab.id} className="bg-card rounded-xl border border-border p-3 mb-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-foreground text-sm font-medium flex-1">{lab.name}</Text>
                  <Text className="text-primary text-sm font-semibold ml-2">
                    {lab.normalMin}–{lab.normalMax} {lab.unit}
                  </Text>
                </View>
                {lab.criticalLow != null && (
                  <Text className="text-red-400 text-xs mt-1">Critical low: &lt;{lab.criticalLow}</Text>
                )}
                {lab.criticalHigh != null && (
                  <Text className="text-red-400 text-xs mt-0.5">Critical high: &gt;{lab.criticalHigh}</Text>
                )}
                {lab.notes && <Text className="text-muted-foreground text-xs mt-1">{lab.notes}</Text>}
              </View>
            ))}
          </View>
        )}

        {tab === "osce" && (
          <View className="px-4">
            {osceList.length === 0 ? (
              <Text className="text-muted-foreground text-sm">OSCE cards coming soon.</Text>
            ) : (
              osceList.map((card) => <OSCECard key={card.id} card={card} />)
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Section({ title, children, accent = false }: any) {
  return (
    <View className="mb-5">
      <Text style={{ color: accent ? "#EAB308" : "#00C896" }} className="text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </Text>
      <View className={`rounded-2xl border p-3 ${accent ? "bg-yellow-500/5 border-yellow-500/20" : "bg-card border-border"}`}>
        {children}
      </View>
    </View>
  );
}

function BulletRow({ text, warn = false }: { text: string; warn?: boolean }) {
  return (
    <View className="flex-row items-start py-1.5 border-b border-border/30">
      <Text style={{ color: warn ? "#EAB308" : "#00C896" }} className="text-xs mr-2 mt-0.5">•</Text>
      <Text className="text-foreground text-sm flex-1 leading-relaxed">{text}</Text>
    </View>
  );
}

function ProtocolStepCard({ step, defaultOpen = false }: { step: any; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const subSteps: string[] = step.subStepsJson ? JSON.parse(step.subStepsJson) : [];
  const table = step.tableJson ? JSON.parse(step.tableJson) : null;

  return (
    <TouchableOpacity onPress={() => setOpen(!open)}
      className="bg-card rounded-2xl border border-border mb-3 overflow-hidden" activeOpacity={0.8}>
      <View className="flex-row items-center p-4">
        <View className="w-7 h-7 rounded-full bg-primary/20 items-center justify-center mr-3">
          <Text className="text-primary text-xs font-bold">{step.stepNumber}</Text>
        </View>
        <Text className="text-foreground font-semibold flex-1">{step.heading}</Text>
        <Text className="text-muted-foreground text-lg">{open ? "−" : "+"}</Text>
      </View>
      {open && (
        <View className="px-4 pb-4 border-t border-border">
          <Text className="text-muted-foreground text-sm leading-relaxed mt-3 mb-2">{step.body}</Text>
          {subSteps.map((s, i) => (
            <View key={i} className="flex-row items-start mb-1.5">
              <Text className="text-primary text-xs mr-2 mt-0.5">›</Text>
              <Text className="text-foreground text-sm flex-1 leading-relaxed">{s}</Text>
            </View>
          ))}
          {table && <TableCard table={table} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

function TableCard({ table }: { table: any }) {
  return (
    <View className="mt-3 bg-muted rounded-xl overflow-hidden border border-border">
      {table.title && (
        <View className="bg-secondary px-3 py-2">
          <Text className="text-foreground text-xs font-semibold">{table.title}</Text>
        </View>
      )}
      <View className="flex-row bg-secondary/50 px-3 py-2">
        {table.headers.map((h: string, i: number) => (
          <Text key={i} className="text-muted-foreground text-xs font-medium flex-1">{h}</Text>
        ))}
      </View>
      {table.rows.map((row: string[], ri: number) => (
        <View key={ri} className={`flex-row px-3 py-2 ${ri % 2 === 0 ? "" : "bg-muted/50"}`}>
          {row.map((cell, ci) => (
            <Text key={ci} className="text-foreground text-xs flex-1">{cell}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function OSCECard({ card }: { card: any }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <View className="bg-card rounded-2xl border border-border mb-3 overflow-hidden">
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <View className="bg-primary/10 rounded-lg px-2 py-0.5 mr-2">
            <Text className="text-primary text-xs capitalize">{card.stationType}</Text>
          </View>
        </View>
        <Text className="text-foreground text-sm font-medium leading-relaxed">{card.question}</Text>
      </View>
      <TouchableOpacity
        onPress={() => setRevealed(!revealed)}
        className="border-t border-border px-4 py-3"
        activeOpacity={0.7}
      >
        {revealed ? (
          <Text className="text-foreground text-sm leading-relaxed">{card.answer}</Text>
        ) : (
          <Text className="text-primary text-sm font-medium text-center">Tap to reveal answer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function IPPAPlaceholder() {
  const items = [
    { cat: "Inspection", steps: ["General appearance, nutrition, hydration", "Skin: rash, jaundice, pallor, cyanosis", "Body habitus, posture, gait"] },
    { cat: "Palpation", steps: ["Temperature, skin turgor", "Lymph nodes: cervical, axillary, inguinal", "Abdomen: tenderness, organomegaly"] },
    { cat: "Percussion", steps: ["Lung fields: dullness vs resonance", "Liver span", "Shifting dullness (ascites)"] },
    { cat: "Auscultation", steps: ["Heart: S1, S2, murmurs", "Lungs: air entry, added sounds", "Bowel sounds"] },
  ];
  return (
    <View>
      {items.map(({ cat, steps }) => (
        <Section key={cat} title={cat}>
          {steps.map((s, i) => <BulletRow key={i} text={s} />)}
        </Section>
      ))}
    </View>
  );
}
