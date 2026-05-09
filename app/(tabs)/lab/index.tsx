import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { EmergencyPill } from "@/components/navigation/EmergencyPill";
import { useDatabase } from "@/db/provider";
import { labReferences } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import {
  type ReviewedLabReport,
  type ReviewedLabValue,
  createReviewedLabReportId,
  getReviewedLabReports,
  interpretLabValue,
  manualOcrAdapter,
  saveReviewedLabReport,
} from "@/lib/lab-reports";
import { getPersona } from "@/lib/persona";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  History,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react-native";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type LabReference = typeof labReferences.$inferSelect;
type SourceMode = ReviewedLabReport["sourceMode"];

const STATUS_COPY: Record<ReviewedLabValue["status"], string> = {
  "critical-low": "Critical low",
  low: "Low",
  normal: "Normal",
  high: "High",
  "critical-high": "Critical high",
  unknown: "Reference unavailable",
};

const STATUS_COLOR: Record<ReviewedLabValue["status"], string> = {
  "critical-low": "#FF3B30",
  low: "#FFA01D",
  normal: "#2BC97A",
  high: "#FFA01D",
  "critical-high": "#FF3B30",
  unknown: "#8A91A8",
};

export default function LabReportScreen() {
  const { db } = useDatabase();
  const [references, setReferences] = useState<LabReference[]>([]);
  const [values, setValues] = useState<Record<number, string>>({});
  const [history, setHistory] = useState<ReviewedLabReport[]>([]);
  const [sourceMode, setSourceMode] = useState<SourceMode>("manual");
  const [loading, setLoading] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getReviewedLabReports());
  }, []);

  useEffect(() => {
    if (!db) return;
    db.select()
      .from(labReferences)
      .limit(7)
      .then((rows) => {
        setReferences(rows);
        setLoading(false);
      });
  }, [db]);

  const reviewedValues = useMemo<ReviewedLabValue[]>(() => {
    const reviewed: ReviewedLabValue[] = [];
    for (const reference of references) {
      const value = Number.parseFloat(values[reference.id] ?? "");
      if (!Number.isFinite(value)) continue;
      reviewed.push({
        referenceId: reference.id,
        name: reference.name,
        unit: reference.unit,
        value,
        normalMin: reference.normalMin,
        normalMax: reference.normalMax,
        criticalLow: reference.criticalLow,
        criticalHigh: reference.criticalHigh,
        notes: reference.notes,
        status: interpretLabValue({
          value,
          normalMin: reference.normalMin,
          normalMax: reference.normalMax,
          criticalLow: reference.criticalLow,
          criticalHigh: reference.criticalHigh,
        }),
      });
    }
    return reviewed;
  }, [references, values]);

  const redFlags = reviewedValues.filter(
    (item) => item.status === "critical-low" || item.status === "critical-high",
  );

  function updateValue(id: number, value: string) {
    setValues((current) => ({
      ...current,
      [id]: value.replace(/[^0-9.-]/g, ""),
    }));
    setSavedAt(null);
  }

  function handleSource(next: SourceMode) {
    triggerSelectionHaptic();
    setSourceMode(next);
  }

  function handleSave() {
    if (reviewedValues.length === 0) return;
    const report: ReviewedLabReport = {
      id: createReviewedLabReportId(),
      createdAt: new Date().toISOString(),
      reviewerPersona: getPersona(),
      sourceMode,
      sourceUri: null,
      values: reviewedValues,
    };
    saveReviewedLabReport(report);
    setHistory(getReviewedLabReports());
    setSavedAt(report.createdAt);
    triggerSuccessHaptic();
  }

  return (
    <ClinicalShell>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 156 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between gap-3 pb-5 pt-2">
          <View className="flex-1">
            <Text className="font-heading text-[30px] leading-10 text-text-primary">
              Lab Report
            </Text>
            <Text className="mt-1 font-body text-[13px] text-text-tertiary">
              Capture, review, interpret offline
            </Text>
          </View>
          <EmergencyPill />
        </View>

        <View className="mb-5 rounded-[28px] border border-surface-glassBorder bg-surface p-4">
          <View className="flex-row items-center justify-between">
            {["Capture", "Review", "Interpret"].map((step, index) => (
              <View key={step} className="flex-1 items-center">
                <View
                  className={[
                    "h-10 w-10 items-center justify-center rounded-full",
                    index === 0 || reviewedValues.length > 0
                      ? "bg-accent-primary"
                      : "bg-surface-muted",
                  ].join(" ")}
                >
                  <Text
                    className={[
                      "font-bodySemi text-[13px]",
                      index === 0 || reviewedValues.length > 0
                        ? "text-text-inverse"
                        : "text-text-tertiary",
                    ].join(" ")}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text className="mt-2 font-bodySemi text-[12px] text-text-primary">
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Panel title="1. Capture" icon={<Camera color="#2470FF" size={18} />}>
          <Text className="font-body text-[13px] leading-5 text-text-secondary">
            V1 keeps OCR behind an adapter. Capture can start from manual entry,
            camera, or upload, but interpretation only uses values you review.
          </Text>
          <View className="mt-4 flex-row gap-2">
            <SourceButton
              active={sourceMode === "manual"}
              label="Manual"
              onPress={() => handleSource("manual")}
            />
            <SourceButton
              active={sourceMode === "camera"}
              label="Camera"
              onPress={() => handleSource("camera")}
            />
            <SourceButton
              active={sourceMode === "upload"}
              label="Upload"
              onPress={() => handleSource("upload")}
            />
          </View>
          <Text className="mt-3 font-body text-[12px] text-text-tertiary">
            OCR adapter: {manualOcrAdapter.name}. Offline after review.
          </Text>
        </Panel>

        <Panel
          title="2. Liability & Limits"
          icon={<ShieldAlert color="#FFA01D" size={18} />}
        >
          <Text className="font-body text-[13px] leading-5 text-text-secondary">
            This module is not a diagnosis. Confirm patient identity, specimen
            timing, units, and reference ranges before acting. Escalate critical
            values through local clinical protocol.
          </Text>
        </Panel>

        <Panel
          title="3. Review Values"
          icon={<SlidersHorizontal color="#2470FF" size={18} />}
        >
          {loading ? (
            <ActivityIndicator color="#2470FF" />
          ) : (
            references.map((reference) => (
              <View
                key={reference.id}
                className="mb-3 rounded-2xl bg-surface-muted px-3 py-3"
              >
                <View className="mb-2 flex-row items-center justify-between gap-3">
                  <View className="flex-1">
                    <Text className="font-bodySemi text-[14px] text-text-primary">
                      {reference.name}
                    </Text>
                    <Text className="font-body text-[11px] text-text-tertiary">
                      {formatRange(reference)}
                    </Text>
                  </View>
                  <View className="min-w-[94px] flex-row items-center rounded-2xl bg-surface px-3">
                    <TextInput
                      className="min-h-[42px] flex-1 text-right font-headingSemi text-[18px] text-text-primary"
                      value={values[reference.id] ?? ""}
                      onChangeText={(text) => updateValue(reference.id, text)}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor="#B8C5E6"
                      accessibilityLabel={`Reviewed value for ${reference.name}`}
                    />
                    {reference.unit ? (
                      <Text className="ml-1 font-body text-[11px] text-text-tertiary">
                        {reference.unit}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))
          )}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Save reviewed lab report"
            activeOpacity={0.78}
            disabled={reviewedValues.length === 0}
            onPress={handleSave}
            className={[
              "mt-1 min-h-[48px] items-center justify-center rounded-2xl",
              reviewedValues.length === 0
                ? "bg-surface-muted"
                : "bg-accent-primary",
            ].join(" ")}
          >
            <Text
              className={[
                "font-bodySemi text-[14px]",
                reviewedValues.length === 0
                  ? "text-text-tertiary"
                  : "text-text-inverse",
              ].join(" ")}
            >
              Save reviewed report
            </Text>
          </TouchableOpacity>
          {savedAt ? (
            <Text className="mt-2 text-center font-body text-[12px] text-accent-green">
              Saved locally for offline review.
            </Text>
          ) : null}
        </Panel>

        <Panel
          title="4. Interpret"
          icon={<FileSearch color="#2470FF" size={18} />}
        >
          {reviewedValues.length === 0 ? (
            <EmptyCopy text="Enter reviewed values to see local range interpretation." />
          ) : (
            reviewedValues.map((item) => (
              <InterpretationRow key={item.referenceId} item={item} />
            ))
          )}
        </Panel>

        <Panel
          title="5. Red Flags"
          icon={<AlertTriangle color="#FF3B30" size={18} />}
        >
          {redFlags.length === 0 ? (
            <EmptyCopy text="No critical high or low values in reviewed entries." />
          ) : (
            redFlags.map((item) => (
              <View
                key={item.referenceId}
                className="mb-2 rounded-2xl border border-clinical-red bg-clinical-redSoft px-3 py-3"
              >
                <Text className="font-bodySemi text-[14px] text-clinical-red">
                  {item.name}: {STATUS_COPY[item.status]}
                </Text>
                <Text className="mt-1 font-body text-[12px] leading-5 text-text-secondary">
                  Re-check units and specimen timing, then escalate according to
                  local protocol.
                </Text>
              </View>
            ))
          )}
        </Panel>

        <Panel
          title="6. Reproducibility"
          icon={<ClipboardCheck color="#2BC97A" size={18} />}
        >
          <InfoLine label="Source" value={sourceMode} />
          <InfoLine label="Reviewer" value={getPersona()} />
          <InfoLine
            label="Changed values"
            value={String(reviewedValues.length)}
          />
          <InfoLine
            label="Snapshot"
            value={
              savedAt ? new Date(savedAt).toLocaleString() : "Not saved yet"
            }
          />
        </Panel>

        <Panel
          title="7. Offline History"
          icon={<History color="#2470FF" size={18} />}
        >
          {history.length === 0 ? (
            <EmptyCopy text="No reviewed lab reports saved on this device yet." />
          ) : (
            history.slice(0, 4).map((report) => (
              <View
                key={report.id}
                className="mb-2 rounded-2xl bg-surface-muted px-3 py-3"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-bodySemi text-[14px] text-text-primary">
                    {report.values.length} reviewed values
                  </Text>
                  <CheckCircle2 color="#2BC97A" size={17} strokeWidth={1.8} />
                </View>
                <Text className="mt-1 font-body text-[12px] text-text-tertiary">
                  {new Date(report.createdAt).toLocaleString()} ·{" "}
                  {report.sourceMode}
                </Text>
              </View>
            ))
          )}
        </Panel>
      </ScrollView>
    </ClinicalShell>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <View className="mb-4 rounded-[28px] border border-surface-glassBorder bg-surface p-4">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-9 w-9 items-center justify-center rounded-2xl bg-surface-muted">
          {icon}
        </View>
        <Text className="flex-1 font-headingSemi text-[17px] text-text-primary">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function SourceButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      activeOpacity={0.78}
      onPress={onPress}
      className={[
        "min-h-[38px] flex-1 items-center justify-center rounded-2xl",
        active ? "bg-accent-primary" : "bg-surface-muted",
      ].join(" ")}
    >
      <Text
        className={[
          "font-bodySemi text-[12px]",
          active ? "text-text-inverse" : "text-text-secondary",
        ].join(" ")}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function InterpretationRow({ item }: { item: ReviewedLabValue }) {
  return (
    <View className="mb-2 flex-row items-center gap-3 rounded-2xl bg-surface-muted px-3 py-3">
      <View
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: STATUS_COLOR[item.status] }}
      />
      <View className="flex-1">
        <Text className="font-bodySemi text-[14px] text-text-primary">
          {item.name}
        </Text>
        <Text className="font-body text-[12px] text-text-tertiary">
          {item.value} {item.unit ?? ""} · {STATUS_COPY[item.status]}
        </Text>
      </View>
    </View>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-border py-2">
      <Text className="font-body text-[13px] text-text-tertiary">{label}</Text>
      <Text className="font-bodySemi text-[13px] text-text-primary">
        {value}
      </Text>
    </View>
  );
}

function EmptyCopy({ text }: { text: string }) {
  return (
    <Text className="font-body text-[13px] leading-5 text-text-tertiary">
      {text}
    </Text>
  );
}

function formatRange(reference: LabReference) {
  const range =
    reference.normalMin != null || reference.normalMax != null
      ? `${reference.normalMin ?? "?"} - ${reference.normalMax ?? "?"}`
      : "No local range";
  return `${range}${reference.unit ? ` ${reference.unit}` : ""}`;
}
