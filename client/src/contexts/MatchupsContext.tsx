import React, { createContext, useState } from "react";
import type { ReactNode } from "react";
import matchupsData from "../json/matchups.json"; // Adjust the path if necessary

// Define the shape of the context
interface MatchupsContextType {
  matchups: typeof matchupsData;
  setMatchups: React.Dispatch<React.SetStateAction<typeof matchupsData>>;
}

// Create the context
export const MatchupsContext = createContext<MatchupsContextType | undefined>(undefined);

// Create the provider component
export const MatchupsProvider = ({ children }: { children: ReactNode }) => {
  const [matchups, setMatchups] = useState(matchupsData);

  return (
    <MatchupsContext.Provider value={{ matchups, setMatchups }}>
      {children}
    </MatchupsContext.Provider>
  );
};
