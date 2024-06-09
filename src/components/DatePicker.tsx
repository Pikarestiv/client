import axios from "axios";
import { ChangeEvent, FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientContext } from "./context/PatientContext";

const DatePicker: FC = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { selectedPatient } = usePatientContext();
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleCheckSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🚀 ~ handleCheckSlots ~ date:", date);

      const url = `${API_BASE_URL}/slots?date=${date}`;
      const response = await axios.get(url);
      console.log("🚀 ~ handleCheckSlots ~ response:", response);

      navigate("/slots", { state: { slots: response.data, date } });
    } catch (error) {
      console.error("Error fetching slots:", error);
      setError("Failed to fetch slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {selectedPatient && (
            <h2 className="text-xl font-bold mb-4">
              Selected Patient: {selectedPatient.name[0].given.join(" ")}{" "}
              {selectedPatient.name[0].family}
            </h2>
          )}
          <h1 className="text-3xl font-bold mb-8">Select a Date</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="mb-4 p-2 border rounded cursor-pointer"
          />
          <button
            onClick={handleCheckSlots}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Check Available Slots
          </button>
        </>
      )}
    </div>
  );
};

export default DatePicker;
