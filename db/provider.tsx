import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { initialize, useMigrationHelper } from "./drizzle";

type DB = Awaited<ReturnType<typeof initialize>>;
const DatabaseContext = React.createContext<{ db: DB | null }>({ db: null });
export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const { success, error } = useMigrationHelper();
  const [db, setDb] = useState<DB | null>(null);
  const [initError, setInitError] = useState<Error | null>(null);
  const canInitialize = Platform.OS === "web" || success;

  useEffect(() => {
    if (!canInitialize) return;
    setInitError(null);
    initialize()
      .then((database) => setDb(() => database))
      .catch((caught: unknown) =>
        setInitError(
          caught instanceof Error ? caught : new Error(String(caught)),
        ),
      );
  }, [canInitialize]);

  const activeError = Platform.OS === "web" ? initError : error;

  if (activeError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#EEF1F8",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: "#FF7A70", fontSize: 13, textAlign: "center" }}>
          DB error: {activeError.message ?? String(activeError)}
        </Text>
      </View>
    );
  }

  if (!db) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#EEF1F8",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <ActivityIndicator color="#1565F9" size="large" />
        <Text style={{ color: "#111D5E", fontSize: 13, marginTop: 12 }}>
          {Platform.OS === "web"
            ? "Loading Clinical OS..."
            : "Setting up Clinical OS..."}
        </Text>
        <Text
          style={{
            color: "#6B7280",
            fontSize: 11,
            marginTop: 4,
          }}
        >
          First launch may take a moment
        </Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}
