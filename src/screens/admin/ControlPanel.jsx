import { useState, useEffect, useRef, useContext } from "react";
import { StorageContext } from "../../contexts/StorageContext.jsx";
import {
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Settings,
  EmojiEvents,
  MusicNote,
  RestartAlt,
  PlayCircleOutline,
  PauseCircleOutline,
  Home as HomeIcon,
  Map,
  Polyline,
  VolunteerActivism,
  VolumeUp,
  ZoomIn,
  Close,
} from "@mui/icons-material";
import { Slider, Box } from "@mui/material";
import { Link } from "react-router";
import CoinFlip from "../../components/CoinFlip";
import TempChar1 from "../../assets/fighters/algonzo.png";
import TempChar2 from "../../assets/fighters/chocolate-brown.png";

// Example genre data (update image paths as needed)
const GENRES = [
  { label: "Hip Hop", value: "hiphop", img: "" },
  { label: "Rock", value: "rock", img: "" },
  { label: "Jazz", value: "jazz", img: "" },
  { label: "Pop", value: "pop", img: "" },
  { label: "Electronic", value: "electronic", img: "" },
];

const KEYS = [
  "C Major",
  "G Major",
  "D Major",
  "A Major",
  "E Major",
  "B Major",
  "F# Major",
  "C# Major",
  "F Major",
  "Bb Major",
  "Eb Major",
  "Ab Major",
  "Db Major",
  "Gb Major",
  "Cb Major",
  "A Minor",
  "E Minor",
  "B Minor",
  "F# Minor",
  "C# Minor",
  "G# Minor",
  "D# Minor",
  "A# Minor",
  "D Minor",
  "G Minor",
  "C Minor",
  "F Minor",
  "Bb Minor",
  "Eb Minor",
  "Ab Minor",
];

export default function ControlPanel() {
  const { data, getValue, setValue } = useContext(StorageContext);
  const [openFighterDialog, setOpenFighterDialog] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [availableFighters, setAvailableFighters] = useState([]);
  const [activeFighters, setActiveFighters] = useState({});
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [fighterNum, setFighterNum] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(120);
  const intervalRef = useRef(null);

  const handleScreenChange = async (screen) => {
    await setValue("currentScreen", screen);
  };

  const handleConfirmFighterSelection = async () => {
    await setValue("activeFighters", {
      ...data.activeFighters,
      [`fighter${fighterNum}`]: selectedFighter,
    });
    handleFighterDialogClose();
    setSelectedFighter(null);
  };

  const handleFighterDialogOpen = (num) => {
    setFighterNum(num);
    setOpenFighterDialog(true);
  };

  const handleFighterDialogClose = () => {
    setOpenFighterDialog(false);
    setSelectedFighter(null);
  };

  const handleServeFighters = async () => {
    await setValue("currentScreen", "fighters");
  };

  const handleConfirmBattle = async () => {
    await setValue("currentScreen", "battle");
  };

  // Countdown effect
  useEffect(() => {
    if (running && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [running, time]);

  useEffect(() => {
    const checkCurrentScreen = async () => {
      const screen = await getValue("currentScreen");
      setCurrentScreen(screen);
    };
    const fetchAvailableFighters = async () => {
      const fighters = await getValue("characters");
      // Generate new blobs for avatarPreview if avatar exists and is a Blob
      const fightersWithBlobs = Object.values(fighters || {}).map((f) => {
        if (f.avatar && typeof f.avatar === "object" && f.avatar instanceof Blob) {
          return { ...f, avatarPreview: URL.createObjectURL(f.avatar) };
        }
        return f;
      });
      setAvailableFighters(fightersWithBlobs);
    };
    const fetchActiveFighters = async () => {
      const availableFighters = await getValue("characters");
      const activeFighters = await getValue("activeFighters");
      let fighter1Obj = activeFighters?.fighter1
        ? Object.values(availableFighters).find((f) => f.id === activeFighters.fighter1)
        : null;

      let fighter2Obj = activeFighters?.fighter2
        ? Object.values(availableFighters).find((f) => f.id === activeFighters.fighter2)
        : null;

      // Generate new blobs for avatarPreview if avatar exists and is a Blob
      if (
        fighter1Obj &&
        fighter1Obj.avatar &&
        typeof fighter1Obj.avatar === "object" &&
        fighter1Obj.avatar instanceof Blob
      ) {
        fighter1Obj = { ...fighter1Obj, avatarPreview: URL.createObjectURL(fighter1Obj.avatar) };
      }
      if (
        fighter2Obj &&
        fighter2Obj.avatar &&
        typeof fighter2Obj.avatar === "object" &&
        fighter2Obj.avatar instanceof Blob
      ) {
        fighter2Obj = { ...fighter2Obj, avatarPreview: URL.createObjectURL(fighter2Obj.avatar) };
      }
      setActiveFighters({ fighter1: fighter1Obj, fighter2: fighter2Obj });
    };
    checkCurrentScreen();
    fetchAvailableFighters();
    fetchActiveFighters();
  }, [data]);

  return (
    <div className="control-panel container">
      <div className="content">
        <div className="accents">
          <div className="tl-curve">
            <svg
              width="629"
              height="391"
              viewBox="0 0 629 391"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="-1108.07"
                y="-354.075"
                width="1713.67"
                height="722.149"
                rx="361.075"
                stroke="#AC8DF2"
                stroke-width="45.8507"
              />
              <rect
                x="-930.403"
                y="-354.075"
                width="1364.06"
                height="722.149"
                rx="361.075"
                stroke="#AC8DF2"
                stroke-width="45.8507"
              />
            </svg>
          </div>
          <div className="br-curve">
            <svg
              width="1005"
              height="181"
              viewBox="0 0 1005 181"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="21.1642"
                y="21.1642"
                width="1582.02"
                height="666.672"
                rx="333.336"
                stroke="#AC8DF2"
                stroke-width="42.3284"
              />
              <rect
                x="185.187"
                y="21.1642"
                width="1259.27"
                height="666.672"
                rx="333.336"
                stroke="#AC8DF2"
                stroke-width="42.3284"
              />
            </svg>
          </div>
          <div className="logo">
            <svg
              width="543"
              height="274"
              viewBox="0 0 543 274"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2.5"
                y="3.5"
                width="538"
                height="267"
                rx="133.5"
                stroke="white"
                stroke-width="5"
              />
              <rect
                x="26.5"
                y="3.5"
                width="490"
                height="267"
                rx="133.5"
                stroke="white"
                stroke-width="5"
              />
              <rect
                x="54.5"
                y="2.5"
                width="435"
                height="269"
                rx="134.5"
                stroke="white"
                stroke-width="5"
              />
              <path
                d="M215.19 63V141.558C215.19 143.799 214.768 146.016 213.907 148.084C213.816 148.299 213.742 148.473 213.692 148.564C212.096 151.476 209.399 152.551 206.248 153.113C190.167 154.578 172.168 154.553 156.236 153.171C152.481 152.849 148.767 150.739 147.451 147.067C147.427 146.992 147.385 146.876 147.352 146.736C146.798 144.784 146.533 142.757 146.533 140.73L146.533 101.464H177.139V139.101H184.584V83.266V63H215.19Z"
                fill="white"
              />
              <path
                d="M296.147 153.686H265.748V121.31H258.005V153.686H227.606V74.0781C227.945 67.1876 231.651 63.8375 238.451 63.5232H285.484C292.143 63.8789 295.783 67.2538 296.147 73.9788V153.686ZM265.756 77.759H258.013V107.033L258.154 107.174H265.607L265.748 107.033V77.759H265.756Z"
                fill="white"
              />
              <path
                d="M340.617 63.5232L352.197 99.1004L353.264 98.0912L363.571 63.5232H395.831V153.686H365.226L366.483 109.639L365.408 109.002L352.611 145.845L351.23 145.141L339.914 109.721L338.342 109.018L339.169 153.686H308.563V63.5232H340.617Z"
                fill="white"
              />
              <path
                d="M182.985 165.657C184.719 165.922 186.612 167.254 187.24 168.973C188.035 171.146 187.99 180.617 187.619 183.161C186.854 188.416 182.834 187.636 178.829 188.385C178.216 188.499 178.17 188.128 178.254 189.127C182.319 189.725 186.877 189.226 187.619 194.336C187.998 196.933 188.051 204.86 187.627 207.396C187.331 209.168 185.166 211.84 183.364 211.84H152.512V166.225L153.08 165.657H182.985ZM172.197 173.228H168.033V185.342H172.197V173.228ZM172.197 192.156C170.842 192.33 169.032 191.648 168.033 192.723V204.08C168.51 204.799 169.342 204.671 170.115 204.671C170.599 204.671 171.091 204.693 171.568 204.587L172.197 204.08V192.156Z"
                fill="white"
              />
              <path
                d="M227.931 212H212.411V195.344H208.625V212H193.104V169.791C193.104 168.209 195.285 166.619 196.723 166.218C200.077 165.279 218.763 165.37 222.775 165.854C224.744 166.097 227.931 167.452 227.931 169.784V211.992V212ZM212.411 173.388H208.625V188.151H212.411V173.388Z"
                fill="white"
              />
              <path
                d="M258.475 177.014V211.84H242.954V177.014H233.112V165.657H268.128L268.696 166.225V176.446L268.128 177.014H258.475Z"
                fill="white"
              />
              <path
                d="M309.46 165.657V177.014H299.617V211.84H283.718V177.014H273.876V165.657H309.46Z"
                fill="white"
              />
              <path
                d="M330.161 165.657V204.08L330.789 204.587C331.266 204.693 331.758 204.671 332.243 204.671C333.015 204.671 333.848 204.799 334.325 204.08V190.263H349.845V211.84H314.64V165.657H330.161Z"
                fill="white"
              />
              <path
                d="M389.853 165.657V181.178H374.332V172.471H370.546V184.963H389.853V192.913H370.546V205.405H374.332V196.32H389.853V211.84H355.026V165.657H389.853Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div className="dashboard">
          <div className="menu">
            <Link to="/admin/bracket">
              <IconButton className="icon bracket" aria-label="bracket">
                <EmojiEvents />
              </IconButton>
            </Link>
            <Link to="/admin/settings">
              <IconButton className="icon settings" aria-label="settings">
                <Settings />
              </IconButton>
            </Link>
          </div>
          <div className="controls">
            <div className="main-panel panel">
              <div
                className="slide-controls"
                style={{
                  display: "flex",
                  padding: "32px 0",
                }}
              >
                {/* Music Slider */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    flex: 1,
                  }}
                >
                  <Slider
                    orientation="vertical"
                    defaultValue={70}
                    aria-label="Music Volume"
                    sx={{
                      height: "100%",
                      minHeight: 220,
                      maxHeight: 400,
                      color: "#9febc9",
                      "& .MuiSlider-thumb": { width: 32, height: 32 },
                    }}
                  />
                  <MusicNote sx={{ mt: 2, fontSize: 40, color: "#fff" }} />
                </Box>
                {/* Sound Effects Slider */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    flex: 1,
                  }}
                >
                  <Slider
                    orientation="vertical"
                    defaultValue={50}
                    aria-label="Sound Effects Volume"
                    sx={{
                      height: "100%",
                      minHeight: 220,
                      maxHeight: 400,
                      color: "#ac8df2",
                      "& .MuiSlider-thumb": { width: 32, height: 32 },
                    }}
                  />
                  <VolumeUp sx={{ mt: 2, fontSize: 40, color: "#fff" }} />
                </Box>
                {/* Zoom Slider */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    flex: 1,
                  }}
                >
                  <Slider
                    orientation="vertical"
                    defaultValue={100}
                    min={50}
                    max={150}
                    aria-label="Zoom"
                    sx={{
                      height: "100%",
                      minHeight: 220,
                      maxHeight: 400,
                      color: "#99dbed",
                      "& .MuiSlider-thumb": { width: 32, height: 32 },
                    }}
                  />
                  <ZoomIn sx={{ mt: 2, fontSize: 40, color: "#fff" }} />
                </Box>
              </div>
              <div className="matchup-controls">
                <div className="player-1 player">
                  <Button
                    className={`winner pill-btn green ${
                      currentScreen !== "battle" ? "disabled" : ""
                    }`}
                    disabled={currentScreen !== "battle"}
                    variant="contained"
                  >
                    Winner
                  </Button>
                  <div
                    className="character"
                    style={{ backgroundImage: `url(${activeFighters.fighter1?.avatarPreview})` }}
                  >
                    <h3 className="character-name">
                      {activeFighters.fighter1?.name || "No Selection"}
                    </h3>
                    <Button
                      className="pill-btn select"
                      variant="contained"
                      onClick={() => handleFighterDialogOpen(1)}
                    >
                      Select Fighter
                    </Button>
                  </div>
                  <Button
                    className={`play-intro pill-btn purple ${
                      currentScreen !== "battle" ? "disabled" : ""
                    }`}
                    variant="contained"
                    startIcon={<MusicNote />}
                    disabled={currentScreen !== "battle"}
                  >
                    Play Intro
                  </Button>
                </div>
                <div className="vs">
                  <Button
                    className="pill-btn"
                    variant="contained"
                    onClick={() => handleServeFighters()}
                  >
                    Serve
                  </Button>

                  <h2>VS</h2>
                  <Button
                    className={`pill-btn ${currentScreen !== "fighters" ? "disabled" : ""}`}
                    variant="contained"
                    disabled={currentScreen !== "fighters"}
                    onClick={() => handleConfirmBattle()}
                  >
                    Confirm
                  </Button>
                </div>
                <div className="player-2 player">
                  <Button
                    className={`winner pill-btn green ${
                      currentScreen !== "battle" ? "disabled" : ""
                    }`}
                    disabled={currentScreen !== "battle"}
                    variant="contained"
                  >
                    Winner
                  </Button>
                  <div
                    className="character"
                    style={{ backgroundImage: `url(${activeFighters.fighter2?.avatarPreview})` }}
                  >
                    <h3 className="character-name">
                      {activeFighters.fighter2?.name || "No Selection"}
                    </h3>
                    <Button
                      className="pill-btn select"
                      variant="contained"
                      onClick={() => handleFighterDialogOpen(2)}
                    >
                      Select Fighter
                    </Button>
                  </div>
                  <Button
                    className={`play-intro pill-btn blue ${
                      currentScreen !== "battle" ? "disabled" : ""
                    }`}
                    variant="contained"
                    startIcon={<MusicNote />}
                    disabled={currentScreen !== "battle"}
                  >
                    Play Intro
                  </Button>
                </div>
              </div>
              <div className="screen-controls">
                <Button
                  className="pill-btn white"
                  variant="contained"
                  startIcon={<HomeIcon />}
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
            </div>
            <div className={`sub-panel panel ${currentScreen !== "battle" ? "disabled" : ""}`}>
              <div className="coin-controls">
                <CoinFlip player1={"Algonzo"} player2={"Chocolate Brown"} />
              </div>
              <div className="genre-controls">
                <div className="genre">
                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#9febc9",
                      },
                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#9febc9",
                      },
                      "& .MuiSelect-icon": {
                        color: "#fff",
                      },
                      "& .MuiSelect-select": {
                        color: "#fff",
                      },
                    }}
                  >
                    <InputLabel id="genre-select-label">Genre</InputLabel>
                    <Select
                      labelId="genre-select-label"
                      value={selectedGenre}
                      label="Genre"
                      onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                      {GENRES.map((g) => (
                        <MenuItem key={g.value} value={g.value}>
                          {g.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedGenre && (
                    <div className="genre-display">
                      {GENRES.find((g) => g.value === selectedGenre)?.label}
                    </div>
                  )}
                </div>
                <div className="key">
                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#9febc9",
                      },
                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#9febc9",
                      },
                      "& .MuiSelect-icon": {
                        color: "#fff",
                      },
                      "& .MuiSelect-select": {
                        color: "#fff",
                      },
                    }}
                  >
                    <InputLabel id="key-select-label">Key</InputLabel>
                    <Select
                      labelId="key-select-label"
                      value={selectedKey}
                      label="Key"
                      onChange={(e) => setSelectedKey(e.target.value)}
                    >
                      {KEYS.map((k) => (
                        <MenuItem key={k} value={k}>
                          {k}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedKey && <div className="key-display">{selectedKey}</div>}
                </div>
              </div>
              <div className="timer-controls">
                <div className={`record ${running ? "active" : ""}`}>
                  <div className="circle"></div>
                  <svg
                    className="vinyl"
                    width="477"
                    height="477"
                    viewBox="0 0 477 477"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="238.5" cy="238.5" r="238.5" fill="black" />
                    <circle cx="238.5" cy="238.5" r="120" fill="#9FEBC9" />
                  </svg>
                  <svg
                    className="tonearm"
                    width="48px"
                    height="96px"
                    viewBox="50 13 2 34"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                  >
                    <g
                      id="Page-1"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                      sketch:type="MSPage"
                    >
                      <g
                        id="Turntable"
                        sketch:type="MSArtboardGroup"
                        transform="translate(0.000000, -8.000000)"
                        fill="#000000"
                      >
                        <path
                          d="M53.5,13 L53.5,40.586 L52.396,41.793 C52.205,41.602 51.769,41.602 51.578,41.793 L48.818,44.553 C48.627,44.744 48.627,45.18 48.818,45.371 L49.775,46.328 C49.966,46.519 50.402,46.519 50.593,46.328 L53.353,43.568 C53.544,43.377 53.544,42.941 53.353,42.75 L54.354,41.749 C54.374,41.729 54.383,41.704 54.399,41.685 C54.421,41.654 54.447,41.627 54.461,41.592 C54.485,41.534 54.496,41.473 54.498,41.412 C54.498,41.408 54.5,41.404 54.5,41.4 L54.5,41.4 L54.5,13 Z"
                          fill="#fff"
                          sketch:type="MSShapeGroup"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  <h3 className="clock">{time}</h3>
                </div>
                <div className="play-restart">
                  <IconButton
                    className="icon play"
                    aria-label="play"
                    onClick={() => setRunning(!running)}
                  >
                    {running ? <PauseCircleOutline /> : <PlayCircleOutline />}
                  </IconButton>
                  <IconButton
                    className="icon restart"
                    aria-label="restart"
                    onClick={() => {
                      setRunning(false);
                      setTime(120);
                    }}
                  >
                    <RestartAlt />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog className="dialog" fullWidth open={openFighterDialog}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px 0 24px",
          }}
        >
          <h3 style={{ margin: 0 }}>Select Fighter</h3>
          <IconButton aria-label="close" onClick={handleFighterDialogClose} size="large">
            <Close />
          </IconButton>
        </div>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="fighter-select-label">Fighter</InputLabel>
            <Select
              labelId="fighter-select-label"
              value={selectedFighter || ""}
              label="Fighter"
              onChange={(e) => setSelectedFighter(e.target.value)}
            >
              {Object.values(availableFighters || {}).map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                      src={f.avatarPreview}
                      alt={f.name}
                      style={{ width: "auto", height: 32, borderRadius: "50%" }}
                    />
                    <span>{f.name}</span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleFighterDialogClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmFighterSelection}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
