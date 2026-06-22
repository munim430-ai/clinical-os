// Stub for web build to prevent @insforge/sdk transitive module resolution errors
export const insforge = {
  auth: {},
  database: {},
  storage: {},
  tokenManager: {
    setAccessToken: () => {},
    clearSession: () => {}
  }
};
export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
