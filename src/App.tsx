// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientSearch from "./components/PatientSearch";
import DatePicker from "./components/DatePicker";
import Slots from "./components/Slots";
import { PatientProvider } from "./components/context/PatientContext";
import Home from "./components/Home";

const App: React.FC = () => {
  return (
    <PatientProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient-search" element={<PatientSearch />} />
          <Route path="/date-picker" element={<DatePicker />} />
          <Route path="/slots" element={<Slots />} />
        </Routes>
      </Router>
    </PatientProvider>
  );
};

export default App;
