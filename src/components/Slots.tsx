import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { usePatientContext } from "./context/PatientContext";

const Slots: React.FC = () => {
  const { selectedPatient } = usePatientContext();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { slots, date } = state || { slots: [], date: "" };

  const [visibleSlots, setVisibleSlots] = useState(5);
  const [sortOrder, setSortOrder] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loadingSlot, setLoadingSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<any | null>(
    null
  );

  if (!state) {
    // Redirect to the date picker if no state is found
    navigate("/date-picker");
    return null;
  }

  const handleBookAppointment = async (slotId: string) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    setLoadingSlot(slotId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/book-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId: selectedPatient?.id, slotId }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      const data = await response.json();
      console.log("Booked appointment data:", data);
      setAppointmentDetails(data);
      setSuccess(`Appointment successfully booked`);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setLoadingSlot(null);
    }
  };

  const loadMoreSlots = () => {
    setVisibleSlots((prev) => prev + 5);
  };

  const handleSortChange = (sortOption: string) => {
    if (sortOrder === sortOption) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOrder(sortOption);
      setSortDirection("asc");
    }
  };

  const sortSlots = (slots: Slot[]) => {
    return slots.sort((a, b) => {
      let compare = 0;
      if (sortOrder === "date") {
        compare = new Date(a.start).getTime() - new Date(b.start).getTime();
      } else if (sortOrder === "status") {
        compare = a.status.localeCompare(b.status);
        // Move 'free' slots to the top
        if (a.status === "free" && b.status !== "free") {
          compare = -1;
        } else if (a.status !== "free" && b.status === "free") {
          compare = 1;
        }
      }
      return sortDirection === "asc" ? compare : -compare;
    });
  };

  const sortedSlots = sortSlots(slots);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!success && (
        <h1 className="text-3xl font-bold mb-8">Available Slots for {date}</h1>
      )}

      {selectedPatient && !success && (
        <h2 className="text-xl font-bold mb-4">
          Selected Patient: {selectedPatient.name[0].given.join(" ")}{" "}
          {selectedPatient.name[0].family}
        </h2>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {success && appointmentDetails && (
        <div
          className="flex flex-col items-center bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <div className="flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4"
              />
            </svg>
          </div>
          <strong className="text-xl mb-2 block">{success}</strong>
          <p className="mb-2">
            <strong>Appointment ID:</strong> {appointmentDetails.id}
          </p>
          <p className="mb-2">
            <strong>Patient Name:</strong>{" "}
            {selectedPatient?.name[0].given.join(" ")}{" "}
            {selectedPatient?.name[0].family}
          </p>
          <p className="mb-2">
            <strong>Patient ID:</strong> {selectedPatient?.id}
          </p>
          <p className="mb-2">
            <strong>Appointment Date:</strong>{" "}
            {appointmentDetails.slot[0].start
              ? new Date(appointmentDetails.slot[0].start).toLocaleString()
              : date}
          </p>
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            Go back Home
          </Link>
        </div>
      )}

      {!success && (
        <>
          <div className="mb-4">
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOrder}
              className="px-4 py-2 mr-2 rounded-lg shadow-md transition bg-blue-500 text-white hover:bg-blue-700 borderRightTransparent"
            >
              <option value="date">Sort by Date/Time</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          <ul className="space-y-4">
            {sortedSlots.slice(0, visibleSlots).map((slot) => (
              <li
                key={slot.id}
                className="bg-white p-4 rounded shadow-md flex justify-between items-center"
              >
                <span className="flex-1">{`Start: ${new Date(
                  slot.start
                ).toLocaleString()} - End: ${new Date(
                  slot.end
                ).toLocaleString()}`}</span>
                <button
                  onClick={() => handleBookAppointment(slot.id)}
                  className={`ml-4 px-4 py-2 rounded-lg shadow-md transition ${
                    slot.status === "free"
                      ? "bg-green-500 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={slot.status !== "free" || loadingSlot === slot.id}
                >
                  {loadingSlot === slot.id
                    ? "Booking..."
                    : slot.status === "free"
                    ? "Book"
                    : "Unavailable"}
                </button>
              </li>
            ))}
          </ul>

          {visibleSlots < slots.length ? (
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                loadMoreSlots();
              }}
              className="mt-4 text-blue-500 hover:text-blue-700 transition flex items-center"
            >
              Show More
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </Link>
          ) : (
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setVisibleSlots(5);
              }}
              className="mt-4 text-blue-500 hover:text-blue-700 transition flex items-center"
            >
              Show Less
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default Slots;

interface Slot {
  resourceType: string;
  id: string;
  start: string;
  end: string;
  status: string;
}

interface LocationState {
  slots: Slot[];
  date: string;
}
