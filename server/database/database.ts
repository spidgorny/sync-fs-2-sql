import { Database } from "./types"; // this is the Database interface we defined earlier
import * as pg from "pg";
const { Pool } = pg.default;
import { Kysely, PostgresDialect } from "kysely";

export let pgPool = new Pool({
	database: "sync-fs",
	host: "127.0.0.1",
	user: "postgres",
	password: "example",
	port: 5432,
	max: 10,
});

const dialect = new PostgresDialect({
	pool: pgPool,
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
	dialect,
	// log: ["query"],
});
