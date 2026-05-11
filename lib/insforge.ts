import { createClient } from "@insforge/sdk";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export const insforge = createClient({
  baseUrl:
    (extra.insforgeUrl as string) ??
    "https://g6e4susm.ap-southeast.insforge.app",
  anonKey: (extra.insforgeAnonKey as string) ?? "",
});

export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
