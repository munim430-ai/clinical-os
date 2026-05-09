import { type SQLJsDatabase, drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";
import * as schema from "./schema";

let _db: SQLJsDatabase<typeof schema> | null = null;

function resolveWebAsset(file: string) {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1";
  const base = isLocal ? `${window.location.origin}/` : document.baseURI;
  return new URL(file, base).href;
}

export const initialize = async (): Promise<SQLJsDatabase<typeof schema>> => {
  if (_db) return _db;
  // Resolve relative to the page base so it works on localhost and on
  // GitHub Pages where the app is served from /clinical-os/.
  const dbUrl = resolveWebAsset("database.sqlite");
  const [SQL, buf] = await Promise.all([
    initSqlJs({ locateFile: (file) => resolveWebAsset(file) }),
    fetch(dbUrl, { cache: "no-store" }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Unable to load database.sqlite (${res.status})`);
      }
      const buffer = await res.arrayBuffer();
      const header = new TextDecoder("ascii").decode(buffer.slice(0, 16));
      if (!header.startsWith("SQLite format 3")) {
        throw new Error("Loaded database.sqlite is not a SQLite database");
      }
      return buffer;
    }),
  ]);
  const sqldb = new SQL.Database(new Uint8Array(buf));
  _db = drizzle(sqldb, { schema });
  return _db;
};

// Stub — web provider uses initialize() directly, not this hook
export const useMigrationHelper = () => ({ success: true, error: undefined });

// Synchronous db accessor — only valid after initialize() resolves.
// content-sync functions that default to `db` will get this; callers
// should always pass the db instance from useDatabase() context instead.
export const db: SQLJsDatabase<typeof schema> = new Proxy(
  {} as SQLJsDatabase<typeof schema>,
  {
    get(_t, prop) {
      if (_db) return (_db as any)[prop];
      throw new Error(
        `Web DB accessed before initialize() — pass db from useDatabase() context (prop: ${String(prop)})`,
      );
    },
  },
);
