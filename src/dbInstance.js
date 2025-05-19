import { PGlite } from "@electric-sql/pglite";

let instance = null;

export async function getDB() {
  if (!instance) {
    instance = new PGlite();
    await instance.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT
      );
    `);
  }
  return instance;
}
