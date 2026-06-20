// Stub for web platform to prevent Metro bundler from resolving native @insforge/sdk
export const insforge = {
  auth: {},
  database: {},
  storage: {},
  tokenManager: {
    setAccessToken: () => {},
    clearSession: () => {},
  },
};

export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
