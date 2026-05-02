import React, { type PropsWithChildren, useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { initialize, useMigrationHelper } from "./drizzle";

type DB = Awaited<ReturnType<typeof initialize>>;
const DatabaseContext = React.createContext<{ db: DB | null }>({ db: null });
export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const { success, error } = useMigrationHelper();
  const [db, setDb] = useState<DB | null>(null);

  useEffect(() => {
    if (success) initialize().then(setDb);
  }, [success]);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#FF4444", fontSize: 13 }}>DB error: {(error as Error).message ?? String(error)}</Text>
      </View>
    );
  }

  if (!db) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#00C896" size="large" />
        <Text style={{ color: "#555", fontSize: 13, marginTop: 12 }}>
          {Platform.OS === "web" ? "Loading Clinical OS..." : "Setting up Clinical OS..."}
        </Text>
        <Text style={{ color: "#333", fontSize: 11, marginTop: 4 }}>First launch may take a moment</Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}
