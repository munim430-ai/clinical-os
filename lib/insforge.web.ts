// Platform-specific stub for web to prevent @insforge/sdk from bleeding into web builds

const notImplementedAsync = async () => ({ error: new Error("insforge is not available on web"), data: null });

export const insforge = {
  auth: {
    signUp: notImplementedAsync,
    signInWithPassword: notImplementedAsync,
    signOut: async () => {},
    verifyEmail: notImplementedAsync,
    sendResetPasswordEmail: async () => ({ error: new Error("insforge is not available on web") }),
  },
  database: {
    from: (table: string) => ({
      insert: async (data: any) => ({ error: new Error("insforge is not available on web") }),
    }),
  },
  storage: {},
  tokenManager: {
    setAccessToken: (token: string) => {},
    clearSession: () => {},
  },
};

export const ifAuth = insforge.auth as any;
export const ifDb = insforge.database as any;
export const ifStorage = insforge.storage as any;
