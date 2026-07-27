import { EmptyState } from "@/components/premium/EmptyState";
import { useDatabase } from "@/db/provider";
import { dataVersions } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import {
  createSnapshot,
  deleteSnapshot,
  exportSnapshot,
  listSnapshots,
  restoreSnapshot,
} from "@/lib/version-control";
import { router } from "expo-router";
import {
  Archive,
  ArrowLeft,
  Download,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DataVersion = typeof dataVersions.$inferSelect;

function typeBadgeColor(type: string): string {
  if (type === "auto") return "#00D7B5";
  if (type === "pre-migration") return "#FFD60A";
  return "#C8F53C";
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BackupScreen() {
  const { db } = useDatabase();
  const [snapshots, setSnapshots] = useState<DataVersion[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!db) return;
    const rows = await listSnapshots(db);
    setSnapshots(rows);
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  if (Platform.OS === "web") {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface"
          >
            <ArrowLeft size={19} color="#F5F5F7" strokeWidth={1.7} />
          </TouchableOpacity>
          <Text className="font-heading text-[19px] text-text-primary">
            Backup & Restore
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center font-body text-[13px] text-text-tertiary">
            Backup & restore is available on the native Android/iOS app.
          </Text>
        </View>
      </View>
    );
  }

  async function handleCreateBackup() {
    if (!db || busy) return;
    setBusy(true);
    try {
      await createSnapshot(db, "manual");
      triggerSuccessHaptic();
      load();
    } catch (err) {
      Alert.alert(
        "Backup failed",
        err instanceof Error ? err.message : String(err),
      );
    } finally {
      setBusy(false);
    }
  }

  function handleRestore(snap: DataVersion) {
    Alert.alert(
      "Restore this snapshot?",
      "A safety backup will be created first. This will overwrite current data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: async () => {
            if (!db || !snap.filePath) return;
            setBusy(true);
            try {
              await restoreSnapshot(db, snap.filePath);
              triggerSuccessHaptic();
              load();
              Alert.alert("Restored", `Data restored from ${snap.version}`);
            } catch (err) {
              Alert.alert(
                "Restore failed",
                err instanceof Error ? err.message : String(err),
              );
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  }

  function handleDelete(snap: DataVersion) {
    Alert.alert("Delete this backup?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!db || !snap.filePath) return;
          await deleteSnapshot(db, snap.id, snap.filePath);
          load();
        },
      },
    ]);
  }

  const totalSize = snapshots.reduce(
    (sum, s) => sum + (s.fileSizeBytes ?? 0),
    0,
  );

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}
          className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface"
        >
          <ArrowLeft size={19} color="#F5F5F7" strokeWidth={1.7} />
        </TouchableOpacity>
        <Text className="font-heading text-[19px] text-text-primary">
          Backup & Restore
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <TouchableOpacity
          disabled={busy}
          onPress={handleCreateBackup}
          className="mb-5 flex-row items-center justify-center gap-2 rounded-clinical bg-accent-primary py-4 shadow-glowLime"
        >
          <Save size={17} color="#0C0C0E" strokeWidth={1.9} />
          <Text className="font-bodySemi text-[15px] text-text-inverse">
            {busy ? "Working…" : "Create Backup Now"}
          </Text>
        </TouchableOpacity>

        <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Snapshots
        </Text>

        {snapshots.length === 0 ? (
          <EmptyState
            icon={Archive}
            title="No backups yet"
            subtitle="Create your first backup to protect your data"
          />
        ) : (
          snapshots.map((snap) => (
            <View
              key={snap.id}
              className="mb-2.5 rounded-clinical border border-border bg-surface p-4"
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-bodySemi text-[13.5px] text-text-primary">
                  {snap.version}
                </Text>
                <View
                  className="rounded-pill px-2.5 py-1"
                  style={{ backgroundColor: `${typeBadgeColor(snap.type)}22` }}
                >
                  <Text
                    className="font-bodySemi text-[10px]"
                    style={{ color: typeBadgeColor(snap.type) }}
                  >
                    {snap.type}
                  </Text>
                </View>
              </View>
              <Text className="mt-1 font-body text-[11px] text-text-tertiary">
                {snap.createdAt
                  ? new Date(snap.createdAt).toLocaleString()
                  : ""}{" "}
                · {snap.recordCount ?? 0} records ·{" "}
                {formatSize(snap.fileSizeBytes)}
              </Text>
              <View className="mt-3 flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleRestore(snap)}
                  className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-accent-primary bg-accent-primarySoft py-2.5"
                >
                  <RotateCcw size={13} color="#C8F53C" />
                  <Text className="font-bodySemi text-[11.5px] text-accent-primary">
                    Restore
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => snap.filePath && exportSnapshot(snap.filePath)}
                  className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2.5"
                >
                  <Download size={13} color="#B8B8BE" />
                  <Text className="font-bodySemi text-[11.5px] text-text-secondary">
                    Export
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(snap)}
                  className="w-11 items-center justify-center rounded-xl border border-border bg-background py-2.5"
                >
                  <Trash2 size={13} color="#FF453A" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {snapshots.length > 0 ? (
          <Text className="mt-2 text-center font-body text-[11px] text-text-tertiary">
            {formatSize(totalSize)} used across {snapshots.length} backup
            {snapshots.length !== 1 ? "s" : ""}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
