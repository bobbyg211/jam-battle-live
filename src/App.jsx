import { useState, useEffect } from "react";
import { HashRouter, useLocation } from "react-router";
import GlobalNav from "./components/GlobalNav.jsx";
import { BackgroundContext } from "./contexts/BackgroundContext.jsx";
import { MatchupsProvider } from "./contexts/MatchupsContext.jsx";
import Router from "./Router.jsx";
import { usePreloadAssets } from "./hooks/usePreloadAssets";
import { CircularProgress } from "@mui/material";

// Stage backgrounds will now be preloaded globally with the rest
const stageImages = import.meta.glob("/src/assets/backgrounds/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

function App() {
  // Preload ALL assets (images + audio) before rendering the app
  const assetsReady = usePreloadAssets({ parallel: true }); // parallel = faster

  // Dot animation state
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (assetsReady) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 0));
    }, 200);
    return () => clearInterval(interval);
  }, [assetsReady]);

  if (!assetsReady) {
    const dots = Array.from({ length: 3 }, (_, i) =>
      i < dotCount ? (
        <span key={i} style={{ display: "inline-block", width: 10 }}>
          .
        </span>
      ) : (
        <span key={i} style={{ display: "inline-block", width: 10 }}>
          &nbsp;
        </span>
      )
    );
    return (
      <div className="loading">
        <CircularProgress style={{ color: "#ff4081", width: 60, height: 60 }} />
        <span
          style={{
            minWidth: 120,
            display: "inline-block",
            textAlign: "center",
            letterSpacing: 2,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Loading{dots}
        </span>
      </div>
    );
  }

  return (
    <HashRouter>
      <GlobalNav />
      <MatchupsProvider>
        <BackgroundProvider>
          <Router />
        </BackgroundProvider>
      </MatchupsProvider>
    </HashRouter>
  );
}

function BackgroundProvider({ children }) {
  const stageImagePaths = Object.values(stageImages); // actual URLs
  const location = useLocation();
  const randomStageImage = stageImagePaths[Math.floor(Math.random() * stageImagePaths.length)];

  return (
    <BackgroundContext.Provider
      key={location.pathname} // Forces remount on route changes
      value={{ background: randomStageImage }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export default App;
