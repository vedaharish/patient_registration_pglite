import { createContext, useContext, useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";

const DBContext = createContext(null);

export function DBProvider({ children }) {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      const dbInstance = new PGlite();

      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT,
          age INTEGER,
          gender TEXT
        );
      `);

      const savedDb = localStorage.getItem("patientDB");
      if (savedDb) {
        try {
          const dbState = JSON.parse(savedDb);
          await dbInstance.load(dbState);
        } catch (error) {
          localStorage.removeItem("patientDB");
        }
      }

      const saveDbToLocalStorage = async () => {
        const dbState = await dbInstance.export();
        localStorage.setItem("patientDB", JSON.stringify(dbState));
      };

      const channel = new BroadcastChannel("patient-db-sync");
      channel.onmessage = (message) => {
        if (message.data === "sync") {
          saveDbToLocalStorage();
        }
      };

      setDb(dbInstance);
      setLoading(false);
    };

    initDB();
  }, []);

  return <DBContext.Provider value={{ db, loading }}>{children}</DBContext.Provider>;
}

export function useDB() {
  return useContext(DBContext);
}
