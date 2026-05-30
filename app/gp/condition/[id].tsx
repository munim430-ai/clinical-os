import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  Stethoscope,
  Pill,
  ExternalLink,
} from "lucide-react";
import { useDatabase } from "@/db/provider";
import {
  conditions,
  symptoms,
  protocols,
  protocolSteps,
  examSteps,
  osceCards,
  labReferences,
  rxEntries,
} from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { ClinicalReaderFrame } from "@/components/reader/ClinicalReaderFrame";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { logCase } from "@/lib/surveillance";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";

const LOGGABLE = ["dengue", "typhoid", "malaria", "cholera"];
const EXAM_CATS = ["inspection", "palpation", "percussion", "auscultation"];

type ReaderTab = "overview" | "rx" | "protocol" | "exam" | "interpret" | "osce";

const TABS: { key: ReaderTab; label: string; Icon: any }[] = [
  { key: "overview", label: "Overview", Icon: BookOpen },
  { key: "rx", label: "Rx", Icon: Pill },
  { key: "protocol", label: "Protocol", Icon: ClipboardList },
  { key: "exam", label: "Exam", Icon: Stethoscope },
  { key: "interpret", label: "Labs", Icon: FlaskConical },
  { key: "osce", label: "OSCE", Icon: GraduationCap },
];

export default function ConditionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [tab, setTab] = useState<ReaderTab>("overview");
  const [condition, setCondition] = useState<any>(null);
  const [symptomList, setSymptomList] = useState<any[]>([]);
  const [protocolList, setProtocolList] = useState<any[]>([]);
  const [stepList, setStepList] = useState<any[]>([]);
  const [examList, setExamList] = useState<any[]>([]);
  const [osceList, setOsceList] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [rxList, setRxList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!db || !id) return;
    setLoading(true);

    Promise.all([
      db.select().from(conditions).where(eq(conditions.id, id)),
      db.select().from(symptoms).where(eq(symptoms.conditionId, id)),
      db.select().from(protocols).where(eq(protocols.conditionId, id)),
      db.select().from(examSteps).where(eq(examSteps.conditionId, id)),
      db.select().from(osceCards).where(eq(osceCards.conditionId, id)),
      db
        .select()
        .from(labReferences)
        .where(eq(labReferences.conditionId, id))
        .limit(20),
      db.select().from(rxEntries).where(eq(rxEntries.conditionId, id)),
    ]).then(([cond, symp, prot, exam, osce, labsData, rx]) => {
      setCondition(cond[0] ?? null);
      setSymptomList(symp);
      setProtocolList(prot);
      setExamList(exam);
      setOsceList(osce);
      setLabs(labsData);
      setRxList(rx.sort((a, b) => (a.priority ?? 1) - (b.priority ?? 1)));

      if (prot[0]) {
        db.select()
          .from(protocolSteps)
          .where(eq(protocolSteps.protocolId, prot[0].id))
          .then(setStepList);
      } else {
        setStepList([]);
      }

      setLoading(false);
    });
  }, [db, id]);

  const toc = useMemo(
    () => TABS.map((item) => ({ id: item.key, title: item.label })),
    [],
  );
  const warningSigns = symptomList.filter((symptom) => symptom.isWarnSign);
  const regularSymptoms = symptomList.filter((symptom) => !symptom.isWarnSign);
  const activeProtocol = protocolList[0];
  const firstLineRx = rxList.filter((r) => (r.priority ?? 1) === 1);
  const secondLineRx = rxList.filter((r) => (r.priority ?? 1) === 2);
  const altRx = rxList.filter((r) => (r.priority ?? 1) === 3);

  if (loading) {
    return (
      <ClinicalShell>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C8F53C" />
          <Text className="mt-3 font-body text-[13px] text-text-muted">
            Loading clinical reader
          </Text>
        </View>
      </ClinicalShell>
    );
  }

  if (!condition) {
    return (
      <ClinicalShell>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-headingBold text-[18px] text-text-primary">
            Condition not found
          </Text>
          <Text className="mt-2 text-center font-body text-[13px] text-text-muted">
            The requested GP Master entry is unavailable offline.
          </Text>
        </View>
      </ClinicalShell>
    );
  }

  return (
    <ClinicalShell padded={false}>
      <View className="flex-1">
        <ClinicalReaderFrame
          title={condition.name}
          subtitle={
            condition.icd10Code
              ? `ICD-10 ${condition.icd10Code} · GP Master protocol`
              : "GP Master protocol"
          }
          toc={toc}
        >
          <View className="mb-4 flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.back();
              }}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-border bg-ink-800"
            >
              <ArrowLeft size={21} color="#F5F5F7" strokeWidth={1.7} />
            </TouchableOpacity>

            {LOGGABLE.includes(id) ? (
              <TouchableOpacity
                onPress={() => {
                  if (!loggedRef.current) {
                    logCase(id as any);
                    loggedRef.current = true;
                    triggerSuccessHaptic();
                  }
                }}
                className="rounded-2xl border border-border-accent bg-mint-soft px-4 py-3"
              >
                <Text className="font-bodySemi text-[12px] text-mint">
                  Log Case
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Disclaimer />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="my-4"
            contentContainerStyle={{ gap: 8 }}
          >
            {TABS.map(({ key, label, Icon }) => {
              const active = tab === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    triggerSelectionHaptic();
                    setTab(key);
                  }}
                  className={[
                    "flex-row items-center gap-2 rounded-pill border px-4 py-2.5",
                    active
                      ? "border-transparent bg-mint"
                      : "border-border bg-ink-800",
                  ].join(" ")}
                  accessibilityRole="tab"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active }}
                >
                  <Icon
                    size={15}
                    color={active ? "#0C0C0E" : "#7A7A80"}
                    strokeWidth={1.6}
                  />
                  <Text
                    className={
                      active
                        ? "font-bodySemi text-[13px] text-text-inverse"
                        : "font-bodySemi text-[13px] text-text-muted"
                    }
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {tab === "overview" ? (
            <View>
              <ReaderSection title="Overview" accent="mint">
                <Text className="font-body text-[16px] leading-7 text-text-secondary">
                  {condition.overview || "Overview content coming soon."}
                </Text>
              </ReaderSection>

              {regularSymptoms.length > 0 ? (
                <ReaderSection title="Symptoms & Signs" accent="teal">
                  {regularSymptoms.map((symptom, index) => (
                    <ClinicalBullet
                      key={symptom.id ?? index}
                      text={symptom.text}
                    />
                  ))}
                </ReaderSection>
              ) : null}

              {warningSigns.length > 0 ? (
                <ReaderSection title="Warning Signs" accent="red">
                  {warningSigns.map((symptom, index) => (
                    <ClinicalBullet
                      key={symptom.id ?? index}
                      text={symptom.text}
                      warn
                    />
                  ))}
                </ReaderSection>
              ) : null}
            </View>
          ) : null}

          {tab === "rx" ? (
            <View>
              {rxList.length === 0 ? (
                <EmptyBlock message="Prescription guidelines coming soon for this condition." />
              ) : (
                <View>
                  {firstLineRx.length > 0 ? (
                    <View className="mb-2">
                      <View className="mb-3 flex-row items-center gap-2">
                        <View className="h-2 w-2 rounded-full bg-mint" />
                        <Text className="font-bodySemi text-[11px] uppercase tracking-[1.7px] text-mint">
                          First-line Treatment
                        </Text>
                      </View>
                      {firstLineRx.map((rx) => (
                        <RxCard key={rx.id} rx={rx} tier="first" />
                      ))}
                    </View>
                  ) : null}

                  {secondLineRx.length > 0 ? (
                    <View className="mb-2 mt-4">
                      <View className="mb-3 flex-row items-center gap-2">
                        <View className="h-2 w-2 rounded-full bg-[#FFD60A]" />
                        <Text className="font-bodySemi text-[11px] uppercase tracking-[1.7px] text-[#FFD60A]">
                          Second-line / Add-on
                        </Text>
                      </View>
                      {secondLineRx.map((rx) => (
                        <RxCard key={rx.id} rx={rx} tier="second" />
                      ))}
                    </View>
                  ) : null}

                  {altRx.length > 0 ? (
                    <View className="mb-2 mt-4">
                      <View className="mb-3 flex-row items-center gap-2">
                        <View className="h-2 w-2 rounded-full bg-[#64D2FF]" />
                        <Text className="font-bodySemi text-[11px] uppercase tracking-[1.7px] text-[#64D2FF]">
                          Alternative
                        </Text>
                      </View>
                      {altRx.map((rx) => (
                        <RxCard key={rx.id} rx={rx} tier="alt" />
                      ))}
                    </View>
                  ) : null}

                  {activeProtocol?.source ? (
                    <View className="mt-4 rounded-2xl border border-border bg-ink-800 px-4 py-3">
                      <Text className="font-body text-[11px] leading-5 text-text-muted">
                        Source: {activeProtocol.source}
                        {activeProtocol.year ? ` (${activeProtocol.year})` : ""}
                      </Text>
                      <Text className="mt-1 font-body text-[11px] leading-5 text-text-muted">
                        Always verify doses against current formulary. These are
                        guidelines only — see Disclaimer.
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          ) : null}

          {tab === "protocol" ? (
            <View>
              {activeProtocol ? (
                <View className="mb-4 rounded-clinical border border-border-accent bg-mint-soft p-4">
                  <Text className="font-bodySemi text-[11px] uppercase tracking-[1.5px] text-text-muted">
                    Protocol Source
                  </Text>
                  <Text className="mt-2 font-headingBold text-[18px] text-mint">
                    {[
                      activeProtocol.source,
                      activeProtocol.version,
                      activeProtocol.year,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                </View>
              ) : null}

              {stepList.length === 0 ? (
                <EmptyBlock message="Protocol content coming soon." />
              ) : (
                stepList.map((step) => (
                  <PremiumProtocolStep key={step.id} step={step} />
                ))
              )}
            </View>
          ) : null}

          {tab === "exam" ? (
            <View>
              {examList.length === 0 ? (
                <View>
                  <EmptyBlock message="Condition-specific exam content coming soon. Showing IPPA baseline." />
                  <IPPAPlaceholder />
                </View>
              ) : (
                EXAM_CATS.map((cat) => {
                  const catSteps = examList.filter(
                    (exam) => exam.category === cat,
                  );
                  if (!catSteps.length) return null;
                  return (
                    <ReaderSection
                      key={cat}
                      title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                      accent="mint"
                    >
                      {catSteps.map((step, index) => (
                        <ClinicalBullet
                          key={step.id ?? index}
                          text={step.text}
                        />
                      ))}
                    </ReaderSection>
                  );
                })
              )}
            </View>
          ) : null}

          {tab === "interpret" ? (
            <View>
              <ReaderSection title="Lab Reference Ranges" accent="teal">
                {labs.map((lab) => (
                  <LabReferenceCard key={lab.id} lab={lab} />
                ))}
              </ReaderSection>
            </View>
          ) : null}

          {tab === "osce" ? (
            <View>
              {osceList.length === 0 ? (
                <EmptyBlock message="OSCE cards coming soon." />
              ) : (
                osceList.map((card) => (
                  <PremiumOSCECard key={card.id} card={card} />
                ))
              )}
            </View>
          ) : null}
        </ClinicalReaderFrame>
      </View>
    </ClinicalShell>
  );
}

// ─── Rx Card ─────────────────────────────────────────────────────────────────

type RxTier = "first" | "second" | "alt";

function RxCard({ rx, tier }: { rx: any; tier: RxTier }) {
  const [expanded, setExpanded] = useState(false);

  const tierColor =
    tier === "first" ? "#C8F53C" : tier === "second" ? "#FFD60A" : "#64D2FF";
  const tierBg =
    tier === "first"
      ? "bg-mint-soft border-border-accent"
      : tier === "second"
        ? "border-[#3D3010]"
        : "border-[#0D2A3D]";
  const tierBgStyle =
    tier === "second"
      ? { backgroundColor: "#1A1500" }
      : tier === "alt"
        ? { backgroundColor: "#001525" }
        : undefined;

  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        setExpanded(!expanded);
      }}
      activeOpacity={0.82}
      className={`mb-3 overflow-hidden rounded-clinical border ${tierBg}`}
      style={tierBgStyle}
    >
      <View className="flex-row items-start p-4">
        <View
          className="mr-3 mt-0.5 h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${tierColor}20` }}
        >
          <Pill size={18} color={tierColor} strokeWidth={1.6} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="flex-1 font-headingBold text-[16px] leading-6 text-text-primary">
              {rx.drugName}
            </Text>
            <Text className="font-heading text-[20px] text-text-muted">
              {expanded ? "−" : "+"}
            </Text>
          </View>
          {rx.drugClass ? (
            <Text className="mt-0.5 font-body text-[12px] text-text-muted">
              {rx.drugClass}
            </Text>
          ) : null}
          {rx.indication ? (
            <Text className="mt-1 font-body text-[13px] leading-5 text-text-secondary">
              {rx.indication}
            </Text>
          ) : null}
        </View>
      </View>

      {expanded ? (
        <View className="border-t border-border-soft px-4 pb-4 pt-3">
          <View className="flex-row flex-wrap gap-2">
            {rx.dosage ? (
              <RxPill label="Dose" value={rx.dosage} color={tierColor} />
            ) : null}
            {rx.frequency ? (
              <RxPill
                label="Frequency"
                value={rx.frequency}
                color={tierColor}
              />
            ) : null}
            {rx.route ? (
              <RxPill label="Route" value={rx.route} color={tierColor} />
            ) : null}
            {rx.duration ? (
              <RxPill label="Duration" value={rx.duration} color={tierColor} />
            ) : null}
          </View>

          {rx.notes ? (
            <View className="mt-3 rounded-2xl border border-border bg-ink-950 px-3 py-2.5">
              <Text className="mb-1 font-bodySemi text-[10px] uppercase tracking-[1.4px] text-text-muted">
                Clinical Notes
              </Text>
              <Text className="font-body text-[13px] leading-5 text-text-secondary">
                {rx.notes}
              </Text>
            </View>
          ) : null}

          {rx.source ? (
            <Text className="mt-2 font-body text-[11px] text-text-muted">
              Source: {rx.source}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              triggerSelectionHaptic();
              router.push(
                `/(tabs)/dims?q=${encodeURIComponent(rx.drugName)}` as any,
              );
            }}
            className="mt-3 flex-row items-center gap-2 self-start rounded-pill border border-border bg-ink-950 px-3 py-2"
            activeOpacity={0.78}
          >
            <ExternalLink size={13} color="#C8F53C" strokeWidth={1.7} />
            <Text className="font-bodySemi text-[12px] text-mint">
              Find in DIMS
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function RxPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View className="rounded-xl border border-border bg-ink-950 px-3 py-2">
      <Text
        className="font-bodySemi text-[10px] uppercase tracking-[1.3px]"
        style={{ color: `${color}99` }}
      >
        {label}
      </Text>
      <Text className="mt-0.5 font-bodySemi text-[13px] text-text-primary">
        {value}
      </Text>
    </View>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function ReaderSection({
  title,
  children,
  accent = "mint",
}: {
  title: string;
  children: ReactNode;
  accent?: "mint" | "teal" | "red";
}) {
  const colorClass =
    accent === "red"
      ? "text-clinical-red"
      : accent === "teal"
        ? "text-clinical-teal"
        : "text-mint";
  const borderClass = accent === "red" ? "border-border-red" : "border-border";
  const bgClass = accent === "red" ? "bg-clinical-redSoft" : "bg-ink-800";

  return (
    <View className="mb-5">
      <Text
        className={`mb-2 font-bodySemi text-[11px] uppercase tracking-[1.7px] ${colorClass}`}
      >
        {title}
      </Text>
      <View className={`rounded-clinical border p-4 ${borderClass} ${bgClass}`}>
        {children}
      </View>
    </View>
  );
}

function ClinicalBullet({
  text,
  warn = false,
}: {
  text: string;
  warn?: boolean;
}) {
  return (
    <View className="flex-row items-start border-b border-border-soft py-2.5 last:border-b-0">
      {warn ? (
        <AlertTriangle
          size={15}
          color="#FF453A"
          strokeWidth={1.7}
          style={{ marginTop: 3, marginRight: 8 }}
        />
      ) : (
        <CheckCircle2
          size={15}
          color="#00D7B5"
          strokeWidth={1.7}
          style={{ marginTop: 3, marginRight: 8 }}
        />
      )}
      <Text className="flex-1 font-body text-[15px] leading-6 text-text-secondary">
        {text}
      </Text>
    </View>
  );
}

function PremiumProtocolStep({ step }: { step: any }) {
  const [open, setOpen] = useState(step.stepNumber === 1);
  const subSteps = parseJsonArray(step.subStepsJson);
  const table = parseJsonObject(step.tableJson);
  const critical = step.severity === "critical" || step.severity === "danger";

  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        setOpen(!open);
      }}
      className={[
        "mb-3 overflow-hidden rounded-clinical border",
        critical
          ? "border-border-red bg-clinical-redSoft"
          : "border-border bg-ink-800",
      ].join(" ")}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={`Step ${step.stepNumber}: ${step.heading || `Step ${step.stepNumber}`}`}
      accessibilityState={{ expanded: open }}
    >
      <View className="flex-row items-center p-4">
        <View
          className={
            critical
              ? "mr-3 h-9 w-9 items-center justify-center rounded-2xl bg-clinical-red"
              : "mr-3 h-9 w-9 items-center justify-center rounded-2xl bg-mint-soft"
          }
        >
          <Text
            className={
              critical
                ? "font-headingBold text-[13px] text-text-primary"
                : "font-headingBold text-[13px] text-mint"
            }
          >
            {step.stepNumber}
          </Text>
        </View>
        <Text className="flex-1 font-headingBold text-[16px] leading-6 text-text-primary">
          {step.heading || `Step ${step.stepNumber}`}
        </Text>
        <Text className="font-heading text-[22px] text-text-muted">
          {open ? "−" : "+"}
        </Text>
      </View>

      {open ? (
        <View className="border-t border-border-soft px-4 pb-4 pt-3">
          <Text className="mb-3 font-body text-[15px] leading-6 text-text-secondary">
            {step.body}
          </Text>
          {subSteps.map((item, index) => (
            <ClinicalBullet
              key={`${step.id}-${index}`}
              text={item}
              warn={critical}
            />
          ))}
          {table ? <PremiumTable table={table} /> : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function PremiumTable({ table }: { table: any }) {
  const headers: string[] = Array.isArray(table.headers) ? table.headers : [];
  const rows: string[][] = Array.isArray(table.rows) ? table.rows : [];

  return (
    <View className="mt-4 overflow-hidden rounded-2xl border border-border bg-ink-950">
      {table.title ? (
        <View className="border-b border-border-soft bg-ink-700 px-3 py-2">
          <Text className="font-bodySemi text-[12px] text-text-primary">
            {table.title}
          </Text>
        </View>
      ) : null}
      {headers.length > 0 ? (
        <View className="flex-row border-b border-border-soft bg-ink-700 px-3 py-2">
          {headers.map((header, index) => (
            <Text
              key={`${header}-${index}`}
              className="flex-1 font-bodySemi text-[11px] text-text-muted"
            >
              {header}
            </Text>
          ))}
        </View>
      ) : null}
      {rows.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          className="flex-row border-b border-border-soft px-3 py-2 last:border-b-0"
        >
          {row.map((cell, cellIndex) => (
            <Text
              key={`cell-${cellIndex}`}
              className="flex-1 font-body text-[12px] leading-5 text-text-secondary"
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function LabReferenceCard({ lab }: { lab: any }) {
  const range = [lab.normalMin, lab.normalMax]
    .filter((value) => value != null)
    .join("–");
  return (
    <View className="mb-3 rounded-2xl border border-border bg-ink-950 p-3">
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 font-bodySemi text-[14px] leading-5 text-text-primary">
          {lab.name}
        </Text>
        {range ? (
          <Text className="font-headingBold text-[14px] text-mint">
            {range} {lab.unit}
          </Text>
        ) : null}
      </View>
      {lab.criticalLow != null || lab.criticalHigh != null ? (
        <View className="mt-3 rounded-xl border border-border-red bg-clinical-redSoft px-3 py-2">
          <Text className="font-bodySemi text-[12px] leading-5 text-clinical-red">
            {[
              lab.criticalLow != null
                ? `Critical low <${lab.criticalLow}`
                : null,
              lab.criticalHigh != null
                ? `Critical high >${lab.criticalHigh}`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </View>
      ) : null}
      {lab.notes ? (
        <Text className="mt-2 font-body text-[12px] leading-5 text-text-muted">
          {lab.notes}
        </Text>
      ) : null}
    </View>
  );
}

function PremiumOSCECard({ card }: { card: any }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View className="mb-3 overflow-hidden rounded-clinical border border-border bg-ink-800">
      <View className="p-4">
        <View className="mb-3 self-start rounded-pill border border-border-accent bg-mint-soft px-3 py-1">
          <Text className="font-bodySemi text-[11px] uppercase tracking-[1.4px] text-mint">
            {card.stationType || "OSCE"}
          </Text>
        </View>
        <Text className="font-bodySemi text-[15px] leading-6 text-text-primary">
          {card.question}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          triggerSelectionHaptic();
          setRevealed(!revealed);
        }}
        className="border-t border-border-soft px-4 py-3"
        activeOpacity={0.78}
      >
        {revealed ? (
          <Text className="font-body text-[14px] leading-6 text-text-secondary">
            {card.answer}
          </Text>
        ) : (
          <Text className="text-center font-bodySemi text-[14px] text-mint">
            Tap to reveal answer
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <View className="mb-4 rounded-clinical border border-border bg-ink-800 p-4">
      <Text className="font-body text-[14px] leading-6 text-text-muted">
        {message}
      </Text>
    </View>
  );
}

function IPPAPlaceholder() {
  const items = [
    {
      cat: "Inspection",
      steps: [
        "General appearance, nutrition, hydration",
        "Skin: rash, jaundice, pallor, cyanosis",
        "Body habitus, posture, gait",
      ],
    },
    {
      cat: "Palpation",
      steps: [
        "Temperature, skin turgor",
        "Lymph nodes: cervical, axillary, inguinal",
        "Abdomen: tenderness, organomegaly",
      ],
    },
    {
      cat: "Percussion",
      steps: [
        "Lung fields: dullness vs resonance",
        "Liver span",
        "Shifting dullness for ascites",
      ],
    },
    {
      cat: "Auscultation",
      steps: [
        "Heart: S1, S2, murmurs",
        "Lungs: air entry and added sounds",
        "Bowel sounds",
      ],
    },
  ];

  return (
    <View>
      {items.map(({ cat, steps }) => (
        <ReaderSection key={cat} title={cat} accent="mint">
          {steps.map((step) => (
            <ClinicalBullet key={step} text={step} />
          ))}
        </ReaderSection>
      ))}
    </View>
  );
}

function parseJsonArray(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) =>
        typeof item === "object" && item.item ? item.item : String(item),
      );
    }
    return [];
  } catch {
    return [];
  }
}

function parseJsonObject(value?: string | null): any | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
