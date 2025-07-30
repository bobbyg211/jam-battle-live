import { useContext } from "react";
import { BackgroundContext } from "./contexts/BackgroundContext.jsx";
import { Routes, Route } from "react-router";
import Home from "./screens/Home.jsx";
import Setup from "./screens/Setup.jsx";
import Donate from "./screens/Donate.jsx";
import Battle from "./screens/Battle.jsx";
import Stages from "./screens/Stages.jsx";
import Fighters from "./screens/Fighters.jsx";
import Bracket from "./screens/Bracket.jsx";

const Router = () => {
  const { background } = useContext(BackgroundContext);

  return (
    <div
      id="main"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/stages" element={<Stages />} />
        <Route path="/fighters" element={<Fighters />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/bracket" element={<Bracket />} />
      </Routes>
    </div>
  );
};

export default Router;
