// Stub for web build where @insforge/sdk shouldn't be included
export const insforge = {
  auth: {} as any,
  database: {} as any,
  storage: {} as any,
  tokenManager: {
    setAccessToken: () => {},
    clearSession: () => {},
  },
};

export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
