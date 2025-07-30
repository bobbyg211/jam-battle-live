import { createContext, useState } from "react";
import matchupsData from "../json/matchups.json"; // Adjust the path if necessary

// Create the context
const MatchupsContext = createContext(undefined);

// Create the provider component
const MatchupsProvider = ({ children }) => {
  const [matchups, setMatchups] = useState(matchupsData);

  return (
    <MatchupsContext.Provider value={{ matchups, setMatchups }}>
      {children}
    </MatchupsContext.Provider>
  );
};

export { MatchupsContext, MatchupsProvider };
