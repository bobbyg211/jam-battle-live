import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { AssetsContext } from "./AssetsContext.jsx";

const BackgroundContext = createContext({ background: "" });

function BackgroundProvider({ children }) {
  const { assets } = useContext(AssetsContext);
  const location = useLocation();
  const [background, setBackground] = useState(null);

  useEffect(() => {
    const stageImagePaths = Object.entries(assets)
      .filter(([key]) => key.startsWith("backgrounds/"))
      .map(([, value]) => value);

    const randomImage = stageImagePaths[Math.floor(Math.random() * stageImagePaths.length)];
    setBackground(randomImage);
  }, [location.pathname, assets]);

  const value = useMemo(() => ({ background }), [background]);

  return (
    <BackgroundContext.Provider key={location.pathname} value={value}>
      {children}
    </BackgroundContext.Provider>
  );
}

export { BackgroundContext, BackgroundProvider };
