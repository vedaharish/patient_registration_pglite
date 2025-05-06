import React, { useState } from "react";
import { useDB } from "./db";

export default function SQLQuery() {
  const { db } = useDB();
  const [sql, setSQL] = useState("SELECT * FROM patients;");
  const [results, setResults] = useState([]);

  const runQuery = async () => {
    if (!db || sql === "") return;
    try {
      console.log("Running query:", sql);

      const res = await db.exec(sql);

      console.log("Query result:", res);
      const rows = res?.[0]?.rows || [];
      setResults(rows);
    } catch (e) {
      console.error("SQL Error:", e);
      alert("Invalid SQL");
    }
  };

  const renderResults = () => {
    if (!results.length) return <p className="text-center text-gray-500 mt-4">No results found.</p>;

    const headers = Object.keys(results[0]);

    return (
      <table className="w-full table-auto mt-4 border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header) => (
              <th key={header} className="border p-2 text-left text-sm font-medium text-gray-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={index} className="odd:bg-gray-50 even:bg-white">
              {headers.map((header) => (
                <td key={header} className="border p-2 text-sm">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Run SQL Query</h2>
      <textarea
        value={sql}
        onChange={(e) => setSQL(e.target.value)}
        className="w-full h-24 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={runQuery}
        className="w-full mt-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Execute
      </button>
      {renderResults()}
    </div>
  );
}
