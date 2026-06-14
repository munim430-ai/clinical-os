import Constants from "expo-constants";

// Stub for web platform to prevent `@insforge/sdk` from bleeding into web builds
const extra = Constants.expoConfig?.extra ?? {};

const createMockClient = () => ({
  auth: {},
  database: {},
  storage: {},
});

export const insforge = createMockClient();
export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
