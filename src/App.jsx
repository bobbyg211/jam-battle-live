import { BrowserRouter, useLocation } from "react-router";
import GlobalNav from "./components/GlobalNav.jsx";
import { BackgroundContext } from "./contexts/BackgroundContext.jsx";
import { MatchupsProvider } from "./contexts/MatchupsContext.jsx";
import Router from "./Router.jsx";

const stageImages = import.meta.glob("/src/assets/backgrounds/*.{png,jpg,jpeg}");

function App() {
  return (
    <BrowserRouter>
      <GlobalNav />
      <MatchupsProvider>
        <BackgroundProvider>
          <Router />
        </BackgroundProvider>
      </MatchupsProvider>
    </BrowserRouter>
  );
}

function BackgroundProvider({ children }) {
  const stageImagePaths = Object.keys(stageImages);
  const location = useLocation(); // Now safely used within BrowserRouter
  const randomStageImage = stageImagePaths[Math.floor(Math.random() * stageImagePaths.length)];

  return (
    <BackgroundContext.Provider
      key={location.pathname} // Use location.pathname to trigger remount on route changes
      value={{ background: randomStageImage }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export default App;
