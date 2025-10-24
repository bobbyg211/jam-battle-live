import { useState, useEffect } from "react";
import { HashRouter } from "react-router";
import GlobalNav from "./components/GlobalNav.jsx";
import Router from "./Router.jsx";
import { AssetsProvider, AssetsContext } from "./contexts/AssetsContext.jsx";
import { BackgroundProvider } from "./contexts/BackgroundContext.jsx";
import { CircularProgress } from "@mui/material";
import { useContext } from "react";

function AppContent() {
  const { ready } = useContext(AssetsContext);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (ready) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 0));
    }, 200);
    return () => clearInterval(interval);
  }, [ready]);

  if (!ready) {
    const dots = Array.from({ length: 3 }, (_, i) => (i < dotCount ? "." : "\u00A0")).join("");

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
    <>
      <GlobalNav />
      <BackgroundProvider>
        <Router />
      </BackgroundProvider>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AssetsProvider>
        <AppContent />
      </AssetsProvider>
    </HashRouter>
  );
}
