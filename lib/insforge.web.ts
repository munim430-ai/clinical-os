// This is a stub for the web platform to prevent the @insforge/sdk dependency
// from breaking the web build, as instructed by the repository memory.

export const insforge = {
  auth: {},
  database: {},
  storage: {},
  tokenManager: {
    setAccessToken: () => {},
    clearSession: () => {},
  }
} as any;

export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
