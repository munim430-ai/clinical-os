export const insforge = {
  auth: {
    signUp: async () => ({ data: null, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => {},
    verifyEmail: async () => ({ data: null, error: null }),
    sendResetPasswordEmail: async () => ({ data: null, error: null }),
  },
  database: {
    from: () => ({
      insert: async () => ({ data: null, error: null }),
    }),
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
