export const createClient = (config: any) => ({
  auth: null,
  database: null,
  storage: null,
});

export const insforge = createClient({});
export const ifAuth = insforge.auth;
export const ifDb = insforge.database;
export const ifStorage = insforge.storage;
