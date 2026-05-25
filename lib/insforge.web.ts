// Stub for web build to prevent @insforge/sdk from breaking Metro resolution on web
export const insforge = {
  auth: {},
  database: {},
  storage: {},
} as any;

export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
