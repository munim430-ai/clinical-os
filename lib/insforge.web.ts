// Web stub for insforge module to prevent @insforge/sdk resolution errors in web builds
export const insforge = {
  auth: {},
  database: {},
  storage: {},
  tokenManager: {
    setAccessToken: () => {},
    clearSession: () => {}
  }
} as any;

export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
