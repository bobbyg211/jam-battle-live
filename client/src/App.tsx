import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import GlobalNav from "./components/GlobalNav";
import { BackgroundContext } from "./contexts/BackgroundContext.tsx";
import { MatchupsProvider } from "./contexts/MatchupsContext";
import Router from "./Router.tsx";

const queryClient = new QueryClient();
const stageImages = import.meta.glob("/src/assets/backgrounds/*.{png,jpg,jpeg}");

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalNav />
        <MatchupsProvider>
          <BackgroundProvider>
            <Router />
          </BackgroundProvider>
        </MatchupsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function BackgroundProvider({ children }: { children: React.ReactNode }) {
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
