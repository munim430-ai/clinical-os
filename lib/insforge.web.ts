// Stub implementation of insforge for web, preventing @insforge/sdk from loading in the web build.
export const insforge = {
  auth: {
    signUp: async () => ({ data: null, error: new Error("Not implemented on web") }),
    signInWithPassword: async () => ({ data: null, error: new Error("Not implemented on web") }),
    signOut: async () => {},
    verifyEmail: async () => ({ data: null, error: new Error("Not implemented on web") }),
    sendResetPasswordEmail: async () => ({ error: new Error("Not implemented on web") }),
  },
  database: {
    from: () => ({ insert: async () => {} }),
  },
  storage: {},
  tokenManager: {
    setAccessToken: () => {},
    clearSession: () => {},
  },
};

export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
