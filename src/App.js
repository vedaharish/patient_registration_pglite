import React from "react";
import { DBProvider } from "./db";
import PatientForm from "./PatientForm";
import SQLQuery from "./SQLQuery";

function App() {
  return (
    <DBProvider>
      <div className="App">
        {/* <h1>Patient Registration</h1> */}
        
        <PatientForm />
        <SQLQuery />
      </div>
    </DBProvider>
  );
}

export default App;
