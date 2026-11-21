import { Routes, Route, Navigate } from "react-router";
import {
  ControlPanel,
  BracketSetup,
  Home,
  Donate,
  Stages,
  Fighters,
  Battle,
  Bracket,
} from "./screens";

const Router = () => {
  return (
    <div id="main">
      <Routes>
        <Route path="/" element={<Navigate to="/display" replace />} />

        {/* ADMIN */}
        <Route path="/admin/control" element={<ControlPanel />} />
        <Route path="/admin/bracket" element={<BracketSetup />} />

        {/* DISPLAY */}
        <Route path="/display" element={<Home />} />
        <Route path="/display/donate" element={<Donate />} />
        <Route path="/display/stages" element={<Stages />} />
        <Route path="/display/fighters" element={<Fighters />} />
        <Route path="/display/battle" element={<Battle />} />
        <Route path="/display/bracket" element={<Bracket />} />
      </Routes>
    </div>
  );
};

export default Router;
