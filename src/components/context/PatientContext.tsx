import { FC, ReactNode, createContext, useContext, useState } from "react";

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function usePatientContext() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientContext must be used within a PatientProvider");
  }
  return context;
}

export const PatientProvider: FC<PatientProviderProps> = ({ children }) => {
  const [foundPatient, setFoundPatient] = useState<PatientData | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(
    null
  );

  const [searchCriteria, setSearchCriteria] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    phone: "",
  });

  const contextValue: PatientContextType = {
    foundPatient,
    selectedPatient,
    searchCriteria,
    setFoundPatient,
    setSelectedPatient,
    setSearchCriteria,
  };

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
};

interface PatientData {
  resourceType: string;
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
  };
  text: {
    status: string;
    div: string;
  };
  identifier: Array<{
    use: string;
    type: {
      text: string;
    };
    system: string;
    value: string;
  }>;
  name: Array<{
    use: string;
    text: string;
    family: string;
    given: string[];
  }>;
  telecom: Array<{
    system: string;
    value: string;
  }>;
  gender: string;
  birthDate: string;
  address: Array<{
    use: string;
    line: string[];
    city: string;
    district: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
}

interface PatientSearchCriteria {
  // id: string;
  firstname: string;
  lastname: string;
  dob: string;
  phone: string;
}

interface PatientContextType {
  foundPatient: PatientData | null;
  selectedPatient: PatientData | null;
  searchCriteria: PatientSearchCriteria;
  setFoundPatient: (patient: PatientData) => void;
  setSelectedPatient: (patient: PatientData) => void;
  setSearchCriteria: (patientCriteria: PatientSearchCriteria) => void;
}

interface PatientProviderProps {
  children: ReactNode;
}
