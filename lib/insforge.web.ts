// Stub for web platform since @insforge/sdk shouldn't be bundled for the web.

export const insforge = {
  auth: {
    signUp: async () => ({ data: null, error: new Error('Not implemented on web') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Not implemented on web') }),
    signOut: async () => {},
    verifyEmail: async () => ({ data: null, error: new Error('Not implemented on web') }),
    sendResetPasswordEmail: async () => ({ error: new Error('Not implemented on web') }),
  },
  database: {
    from: () => ({
      insert: async () => ({ data: null, error: new Error('Not implemented on web') }),
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
