import { useState, useEffect } from "react";
import { useDB } from "./db";

function PatientForm() {
  const { db, loading } = useDB();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [patients, setPatients] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) return;

    await db.exec(`
      INSERT INTO patients (name, age, gender)
      VALUES ('${name}', ${age}, '${gender}');
    `);

    setName("");
    setAge("");
    setGender("");
    fetchPatients();
  };

  const fetchPatients = async () => {
    if (!db) return;

    try {
      const result = await db.exec("SELECT * FROM patients");
      setPatients(result[0]?.rows || []);
      console.log(result);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    if(db) {
        fetchPatients();
    }
  }, [db]);

// useEffect(() => {
//     const storedPatients = localStorage.getItem("patients");
  
//     if (storedPatients) {
//       setPatients(JSON.parse(storedPatients));
//     } else {
//       fetchPatients();
//     }
//   }, []);

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

        {/* <div className="flex flex-col">
          <label htmlFor="gender" className="text-sm font-medium mb-2">Gender</label>
          <input
            id="gender"
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Enter patient's gender"
            className="p-2 border border-gray-300 rounded"
            required
          />

        </div> */}

        <div>
        <label htmlFor="gender" className="text-sm font-medium mb-2">Gender</label>
          <select
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
