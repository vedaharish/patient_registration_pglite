import { useState, useEffect, useCallback } from "react";
import { useDB } from "./db";

function PatientForm() {
  const { db, loading } = useDB();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [patients, setPatients] = useState([]);

  const escapeValue = (value) => value.replace(/'/g, "''");

  const fetchPatients = useCallback(async () => {
    if (!db) return;

    try {
      const result = await db.exec("SELECT * FROM patients");
      setPatients(result[0]?.rows || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) return;
  
    const escapedName = escapeValue(name);
    const escapedGender = escapeValue(gender);
  
    await db.exec(
      `INSERT INTO patients (name, age, gender)
       VALUES ('${escapedName}', ${Number(age)}, '${escapedGender}');`
    );
  
    // Update localStorage manually
    const existing = JSON.parse(localStorage.getItem("patientData") || "[]");
    existing.push({ name, age: Number(age), gender });
    localStorage.setItem("patientData", JSON.stringify(existing));
  
    // Broadcast to other tabs
    const channel = new BroadcastChannel("patient-db-sync");
    channel.postMessage("sync");
    channel.close();
  
    setName("");
    setAge("");
    setGender("");
    fetchPatients();
  };
  

  useEffect(() => {
    if (db) {
      fetchPatients();
    }
  }, [db, fetchPatients]);

  useEffect(() => {
    const channel = new BroadcastChannel("patient-db-sync");
    channel.onmessage = (msg) => {
      if (msg.data === "sync") {
        fetchPatients();
      }
    };
    return () => channel.close();
  }, [fetchPatients]);

  if (loading || !db) {
    return <p className="text-center text-xl">Loading database...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Patient Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium mb-2">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter patient's name"
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="age" className="text-sm font-medium mb-2">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter patient's age"
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="text-sm font-medium mb-2">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
        >
          Register Patient
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-4">Patients List</h3>
      <ul className="space-y-2">
        {patients.map((patient) => (
          <li key={patient.id} className="p-2 border-b border-gray-200">
            {patient.name} - {patient.age} - {patient.gender}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientForm;
