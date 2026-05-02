import { type SQLJsDatabase, drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";
import * as schema from "./schema";

let _db: SQLJsDatabase<typeof schema> | null = null;

export const initialize = async (): Promise<SQLJsDatabase<typeof schema>> => {
  if (_db) return _db;
  const [SQL, buf] = await Promise.all([
    initSqlJs({ locateFile: (file) => `https://sql.js.org/dist/${file}` }),
    fetch("/database.sqlite").then((res) => res.arrayBuffer()),
  ]);
  const sqldb = new SQL.Database(new Uint8Array(buf));
  _db = drizzle(sqldb, { schema });
  return _db;
};

// Stub — web provider uses initialize() directly, not this hook
export const useMigrationHelper = () => ({ success: true, error: undefined });
