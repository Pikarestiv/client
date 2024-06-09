import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientContext } from "./context/PatientContext";

const PatientSearch: React.FC = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const {
    foundPatient,
    searchCriteria,
    setFoundPatient,
    setSelectedPatient,
    setSearchCriteria,
  } = usePatientContext();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const isSearchCriteriaValid = () => {
    return (
      searchCriteria.firstname.trim() !== "" ||
      searchCriteria.lastname.trim() !== "" ||
      searchCriteria.dob.trim() !== "" ||
      searchCriteria.phone.trim() !== ""
    );
  };

  const handleSearch = async () => {
    if (!isSearchCriteriaValid()) {
      setError("Please fill in at least one search criteria.");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    setLoading(true);
    console.log("🚀 ~ handleSearch ~ searchCriteria:", searchCriteria);

    try {
      const url = `${API_BASE_URL}/search-patients`;
      setError(null);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchCriteria),
      });
      if (!response.ok) {
        throw new Error("Failed to search patients");
      }
      const data = await response.json();
      setFoundPatient(data);
    } catch (error) {
      console.error("Error searching patients:", error);
      setError("Failed to search patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    navigate("/date-picker");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!foundPatient && (
        <>
          <h1 className="text-3xl font-bold mb-8">Search for a Patient</h1>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {loading && <div className="loader"></div>}

          {!loading && (
            <div className="mb-4 w-full max-w-md">
              <div className="mb-4">
                <input
                  type="text"
                  name="firstname"
                  value={searchCriteria.firstname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="lastname"
                  value={searchCriteria.lastname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="date"
                  name="dob"
                  value={searchCriteria.dob}
                  onChange={handleInputChange}
                  placeholder="Date of Birth"
                  className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  value={searchCriteria.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          )}
          {/* {loading && <div>Loading...</div>} */}
        </>
      )}
      {!loading && foundPatient && (
        <>
          <h2 className="text-2xl font-bold mb-4">Patient Found</h2>
          <div className="bg-white p-4 rounded shadow-md flex flex-col">
            <div className="mb-2">
              <strong>Name:</strong> {foundPatient.name[0].given.join(" ")}{" "}
              {foundPatient.name[0].family}
            </div>
            <div className="mb-2">
              <strong>DOB:</strong> {foundPatient.birthDate}
            </div>
            <div className="mb-2">
              <strong>Contact:</strong>{" "}
              {foundPatient.telecom.map((t) => t.value).join(", ")}
            </div>
            <div className="mb-2">
              <strong>Address:</strong>{" "}
              {foundPatient.address[0].line.join(", ")},{" "}
              {foundPatient.address[0].city}, {foundPatient.address[0].state},{" "}
              {foundPatient.address[0].country}
            </div>
            <button
              onClick={() => handleSelectPatient(foundPatient)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 self-end"
            >
              Proceed
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientSearch;
