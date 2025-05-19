// DBProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import { getDB } from "./dbInstance";

const DBContext = createContext(null);

export function DBProvider({ children }) {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("DBProvider initialized");
    const initDB = async () => {
      const dbInstance = await getDB();

      const savedPatients = localStorage.getItem("patientData");
      if (savedPatients) {
        try {
          const patients = JSON.parse(savedPatients);
          const result = await dbInstance.exec("SELECT COUNT(*) as total FROM patients;");
          console.log(result);
          // let count = 0;
          // if(result.rows) {
          //   count = parseInt(result.rows[0].count);
          //   console.log('count', count);
          // }
          

          let count = 0;
if (result.rows) {
  count = parseInt(result.rows[0].total);
  console.log('count', count);
}

          if (count === 0) {
            for (const patient of patients) {
              await dbInstance.exec(`
                INSERT INTO patients (name, age, gender)
                VALUES ('${patient.name}', ${patient.age}, '${patient.gender}');
              `);
            }
          }
        } catch (error) {
          console.error("Failed to load patients from localStorage:", error);
        }
      }

      const channel = new BroadcastChannel("patient-db-sync");
      // channel.onmessage = () => window.location.reload();
      
      channel.onmessage = () => {
        console.log("Sync triggered from another tab");
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
