import { createContext } from "react";

// Create the context
const MatchupsContext = createContext(undefined);

// Create the provider component
const MatchupsProvider = ({ children, assets }) => {
  return <MatchupsContext.Provider value={{ assets }}>{children}</MatchupsContext.Provider>;
};

export { MatchupsContext, MatchupsProvider };
