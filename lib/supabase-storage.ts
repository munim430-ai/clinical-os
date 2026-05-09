import { MMKV } from "react-native-mmkv";

const store = new MMKV({ id: "clinical-os-supabase-auth" });

export const supabaseAuthStorage = {
  getItem(key: string) {
    return store.getString(key) ?? null;
  },
  setItem(key: string, value: string) {
    store.set(key, value);
  },
  removeItem(key: string) {
    store.delete(key);
  },
};
