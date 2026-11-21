import { useContext } from "react";
import { StorageContext } from "../../contexts/StorageContext.jsx";
import { Button } from "@mui/material";
import { Home, Map, Polyline, VolunteerActivism } from "@mui/icons-material";

export default function ScreenSwitch() {
  const { setValue } = useContext(StorageContext);

  const handleScreenChange = async (screen) => {
    await setValue("currentScreen", screen);
  };

  return (
    <div className="screen-switch">
      <Button
        className="pill-btn white"
        variant="contained"
        startIcon={<Home />}
        onClick={() => handleScreenChange("home")}
      >
        Home
      </Button>
      <Button
        className="pill-btn white"
        variant="contained"
        startIcon={<Map />}
        onClick={() => handleScreenChange("stages")}
      >
        Stages
      </Button>
      <Button
        className="pill-btn white"
        variant="contained"
        startIcon={<Polyline />}
        onClick={() => handleScreenChange("bracket")}
      >
        Bracket
      </Button>
      <Button
        className="pill-btn white"
        variant="contained"
        startIcon={<VolunteerActivism />}
        onClick={() => handleScreenChange("donate")}
      >
        Donate
      </Button>
    </div>
  );
}
