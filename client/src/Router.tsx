import { useContext } from "react";
import { BackgroundContext } from "./contexts/BackgroundContext";
import { Routes, Route } from "react-router";
import Start from "./screens/Start";
import Home from "./screens/Home";
import Donate from "./screens/Donate";
import Battle from "./screens/Battle";
import Stages from "./screens/Stages";
import Fighters from "./screens/Fighters";
import Bracket from "./screens/Bracket";

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
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
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
