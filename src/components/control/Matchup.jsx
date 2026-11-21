import { useState, useContext, useRef, useEffect } from "react";
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
import { MusicNote, Close } from "@mui/icons-material";

export default function Matchup({ currentScreen, availableFighters, activeFighters }) {
  const { data, setValue } = useContext(StorageContext);
  const [openFighterDialog, setOpenFighterDialog] = useState(false);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [fighterNum, setFighterNum] = useState(1);
  const introAudioRef = useRef(null);
  const introUrlRef = useRef(null);
  const currentIntroNumRef = useRef(null);
  const [playingIntroFor, setPlayingIntroFor] = useState(null); // 1 | 2 | null
  const [progress, setProgress] = useState({ 1: 0, 2: 0 }); // percentage 0-100
  const [completedFor, setCompletedFor] = useState(null); // 1 | 2 | null

  const setProgressFor = (num, value) =>
    setProgress((p) => ({ ...p, [num]: Math.max(0, Math.min(100, value)) }));

  const handleConfirmFighterSelection = async () => {
    await setValue("activeFighters", {
      ...data.activeFighters,
      [`fighter${fighterNum}`]: selectedFighter,
    });
    handleFighterDialogClose();
  };

  const handleFighterDialogOpen = (num) => {
    setFighterNum(num);
    const currentFighter = activeFighters[`fighter${num}`]?.id || null;
    setSelectedFighter(currentFighter);
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

  const cleanupIntroAudio = () => {
    if (introAudioRef.current) {
      try {
        introAudioRef.current.pause();
        introAudioRef.current.currentTime = 0;
      } catch (e) {
        console.warn("Failed to pause/rewind intro audio:", e);
      }
      introAudioRef.current = null;
    }
    if (introUrlRef.current) {
      try {
        URL.revokeObjectURL(introUrlRef.current);
      } catch (e) {
        console.warn("Failed to revoke intro audio URL:", e);
      }
      introUrlRef.current = null;
    }
    currentIntroNumRef.current = null;
    setPlayingIntroFor(null);
    setCompletedFor(null);
    setProgress({ 1: 0, 2: 0 });
  };

  useEffect(() => {
    return () => cleanupIntroAudio();
  }, []);

  // If leaving the battle screen, stop any playing intro
  useEffect(() => {
    if (currentScreen !== "battle") {
      cleanupIntroAudio();
    }
  }, [currentScreen]);

  const handlePlayIntro = (num) => {
    try {
      const fighter = activeFighters?.[`fighter${num}`];
      const fileOrUrl = fighter?.introSong;
      if (!fileOrUrl) {
        console.warn(`No introSong found for fighter${num}`);
        return;
      }

      // If previously completed, clicking should reset progress only
      if (completedFor === num && !introAudioRef.current) {
        setCompletedFor(null);
        setProgressFor(num, 0);
        return;
      }

      // If same fighter is currently playing, toggle: pause and reset
      if (
        introAudioRef.current &&
        currentIntroNumRef.current === num &&
        !introAudioRef.current.paused
      ) {
        try {
          introAudioRef.current.pause();
          introAudioRef.current.currentTime = 0;
        } catch (e) {
          console.warn("Failed to pause/reset current intro:", e);
        }
        if (introUrlRef.current) {
          try {
            URL.revokeObjectURL(introUrlRef.current);
          } catch (e) {
            console.warn("Failed to revoke blob URL on toggle off:", e);
          }
          introUrlRef.current = null;
        }
        introAudioRef.current = null;
        currentIntroNumRef.current = null;
        setPlayingIntroFor(null);
        setProgressFor(num, 0);
        setCompletedFor(null);
        return;
      }

      // Stop any existing intro before playing a new one (other fighter or paused)
      cleanupIntroAudio();

      let url = null;
      if (fileOrUrl instanceof Blob) {
        url = URL.createObjectURL(fileOrUrl);
        introUrlRef.current = url;
      } else if (typeof fileOrUrl === "string") {
        url = fileOrUrl; // already a URL
      } else {
        console.warn("introSong is not a Blob/File or URL string");
        return;
      }

      const audio = new Audio(url);
      audio.preload = "auto";
      audio.play().catch((err) => console.error("Intro audio playback failed:", err));

      // Track progress
      audio.ontimeupdate = () => {
        const dur = audio.duration || 0;
        if (dur > 0 && !isNaN(dur)) {
          setProgressFor(num, (audio.currentTime / dur) * 100);
        }
      };

      // Cleanup the blob URL after playback ends
      audio.onended = () => {
        if (introUrlRef.current) {
          URL.revokeObjectURL(introUrlRef.current);
          introUrlRef.current = null;
        }
        introAudioRef.current = null;
        currentIntroNumRef.current = null;
        setPlayingIntroFor(null);
        setProgressFor(num, 100);
        setCompletedFor(num);
      };

      introAudioRef.current = audio;
      currentIntroNumRef.current = num;
      setPlayingIntroFor(num);
      setCompletedFor(null);
      setProgressFor(num, 0);
    } catch (err) {
      console.error("Failed to play introSong:", err);
    }
  };

  return (
    <div className="matchup">
      <div className="player-1 player">
        <Button
          className={`winner pill-btn green ${currentScreen !== "battle" ? "disabled" : ""}`}
          disabled={currentScreen !== "battle"}
          variant="contained"
        >
          Winner
        </Button>
        <div
          className="character"
          style={{ backgroundImage: `url(${activeFighters.fighter1?.avatarPreview})` }}
        >
          <h3 className="character-name">{activeFighters.fighter1?.name || "No Selection"}</h3>
          <Button
            className="pill-btn select"
            variant="contained"
            onClick={() => handleFighterDialogOpen(1)}
          >
            Select Fighter
          </Button>
        </div>
        <Button
          className={`play-intro pill-btn purple ${currentScreen !== "battle" ? "disabled" : ""}`}
          variant="contained"
          startIcon={<MusicNote />}
          disabled={currentScreen !== "battle"}
          onClick={() => handlePlayIntro(1)}
          sx={{
            position: "relative",
            background: `linear-gradient(to right, rgba(172,141,242,0.35) ${progress[1]}%, rgba(0,0,0,0) ${progress[1]}%) !important`,
            transition: playingIntroFor === 1 ? "none" : "background 0.2s ease",
          }}
        >
          {playingIntroFor === 1 ? "Stop Intro" : completedFor === 1 ? "Reset Intro" : "Play Intro"}
        </Button>
      </div>
      <div className="vs">
        <Button
          className={`pill-btn ${
            activeFighters.fighter1 == null || activeFighters.fighter2 == null ? "disabled" : ""
          }`}
          variant="contained"
          disabled={activeFighters.fighter1 == null || activeFighters.fighter2 == null}
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
          className={`winner pill-btn green ${currentScreen !== "battle" ? "disabled" : ""}`}
          disabled={currentScreen !== "battle"}
          variant="contained"
        >
          Winner
        </Button>
        <div
          className="character"
          style={{ backgroundImage: `url(${activeFighters.fighter2?.avatarPreview})` }}
        >
          <h3 className="character-name">{activeFighters.fighter2?.name || "No Selection"}</h3>
          <Button
            className="pill-btn select"
            variant="contained"
            onClick={() => handleFighterDialogOpen(2)}
          >
            Select Fighter
          </Button>
        </div>
        <Button
          className={`play-intro pill-btn blue ${currentScreen !== "battle" ? "disabled" : ""}`}
          variant="contained"
          startIcon={<MusicNote />}
          disabled={currentScreen !== "battle"}
          onClick={() => handlePlayIntro(2)}
          sx={{
            position: "relative",
            background: `linear-gradient(to right, rgba(153,219,237,0.35) ${progress[2]}%, rgba(0,0,0,0) ${progress[2]}%) !important`,
            transition: playingIntroFor === 2 ? "none" : "background 0.2s ease",
          }}
        >
          {playingIntroFor === 2 ? "Stop Intro" : completedFor === 2 ? "Reset Intro" : "Play Intro"}
        </Button>
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
              {Object.values(availableFighters || {}).map((f) => {
                // Disable if this fighter is already selected for the other slot
                const otherNum = fighterNum === 1 ? 2 : 1;
                const otherFighterId = activeFighters[`fighter${otherNum}`]?.id;
                const isDisabled = f.id === otherFighterId;
                return (
                  <MenuItem key={f.id} value={f.id} disabled={isDisabled}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img
                        src={f.avatarPreview}
                        alt={f.name}
                        style={{ width: "auto", height: 32, borderRadius: "50%" }}
                      />
                      <span>{f.name}</span>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setSelectedFighter(null)}>
            Clear
          </Button>
          <Button variant="contained" onClick={handleConfirmFighterSelection}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
