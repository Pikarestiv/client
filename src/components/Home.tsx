import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/patient-search");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Appt. Scheduler Test</h1>
      <button
        onClick={handleGetStarted}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Home;
