import { useEffect, useState, useContext } from "react";
import { AssetsContext } from "../contexts/AssetsContext.jsx";
import { Dialog, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../assets/jam-battle-logo.png";
import localforage from "localforage";

localforage.config({
  name: "JamBattleLive",
  storeName: "bracket",
});

export default function Setup() {
  const { refreshAssets } = useContext(AssetsContext);
  const [open, setOpen] = useState(false);
  const [stageImage, setStageImage] = useState(null);
  const [stageName, setStageName] = useState("");
  const [stagePreview, setStagePreview] = useState(null);
  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [player1, setPlayer1] = useState({
    name: "",
    insta: "",
    introSong: null,
    avatar: null,
    avatarPreview: null,
  });
  const [player2, setPlayer2] = useState({
    name: "",
    insta: "",
    introSong: null,
    avatar: null,
    avatarPreview: null,
  });
  const [matchups, setMatchups] = useState({});

  /* ========= STAGE ========== */

  const handleStageOpen = () => setOpen(true);
  const handleStageClose = () => setOpen(false);

  const handleStageClear = async () => {
    await localforage.removeItem("stage");
    refreshAssets(); // ✅ Refresh after clear
    setStageName("");
    setStageImage(null);
    setStagePreview(null);
  };

  const handleStageSave = async () => {
    await localforage.setItem("stage", { name: stageName, image: stageImage });
    refreshAssets(); // ✅ Refresh after save
    setOpen(false);
  };

  const handleStageImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStageImage(file);
      setStagePreview(URL.createObjectURL(file));
    } else {
      setStageImage(null);
      setStagePreview(null);
    }
  };

  /* ========= MATCHUPS ========== */

  const handleMatchSetupOpen = async (matchNumber) => {
    const matchData = await localforage.getItem(`match_${matchNumber}`);
    if (matchData) {
      setPlayer1(
        matchData.player1 && matchData.player1.avatar
          ? { ...matchData.player1, avatarPreview: URL.createObjectURL(matchData.player1.avatar) }
          : { ...matchData.player1 }
      );
      setPlayer2(
        matchData.player2 && matchData.player2.avatar
          ? { ...matchData.player2, avatarPreview: URL.createObjectURL(matchData.player2.avatar) }
          : { ...matchData.player2 }
      );
    } else {
      setPlayer1({ name: "", insta: "", introSong: null, avatar: null, avatarPreview: null });
      setPlayer2({ name: "", insta: "", introSong: null, avatar: null, avatarPreview: null });
    }
    setSelectedMatch(matchNumber);
    setOpenMatchDialog(true);
  };

  const handleMatchSetupClose = () => {
    setSelectedMatch(null);
    setOpenMatchDialog(false);
  };

  const handlePlayerChange = (player, field, value) => {
    if (player === 1) setPlayer1((prev) => ({ ...prev, [field]: value }));
    else setPlayer2((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlayerAvatarChange = (player, e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (player === 1) setPlayer1((prev) => ({ ...prev, avatar: file, avatarPreview: preview }));
      else setPlayer2((prev) => ({ ...prev, avatar: file, avatarPreview: preview }));
    } else {
      if (player === 1) setPlayer1((prev) => ({ ...prev, avatar: null, avatarPreview: null }));
      else setPlayer2((prev) => ({ ...prev, avatar: null, avatarPreview: null }));
    }
  };

  const handlePlayerIntroSongChange = (player, e) => {
    const file = e.target.files[0];
    if (player === 1) setPlayer1((prev) => ({ ...prev, introSong: file }));
    else setPlayer2((prev) => ({ ...prev, introSong: file }));
  };

  const handleMatchSetupSave = async () => {
    await localforage.setItem(`match_${selectedMatch}`, {
      player1,
      player2,
    });
    refreshAssets(); // ✅ Refresh after save
    setOpenMatchDialog(false);
    setSelectedMatch(null);
    setPlayer1({ name: "", insta: "", introSong: null, avatar: null, avatarPreview: null });
    setPlayer2({ name: "", insta: "", introSong: null, avatar: null, avatarPreview: null });
    fetchMatchups();
  };

  const handleMatchSetupClear = async () => {
    await localforage.removeItem(`match_${selectedMatch}`);
    refreshAssets(); // ✅ Refresh after clear
    setPlayer1({ name: "", insta: "", introSong: null, avatar: null, avatarPreview: null });
    setPlayer2({ name: "", insta: "", introSong: null, avatar: null, avatarPreview: null });
    fetchMatchups();
  };

  const fetchMatchups = async () => {
    const newMatchups = {};
    for (let i = 1; i <= 4; i++) {
      const data = await localforage.getItem(`match_${i}`);
      if (data) {
        const patchedPlayer1 =
          data.player1 && data.player1.avatar
            ? { ...data.player1, avatarPreview: URL.createObjectURL(data.player1.avatar) }
            : { ...data.player1 };
        const patchedPlayer2 =
          data.player2 && data.player2.avatar
            ? { ...data.player2, avatarPreview: URL.createObjectURL(data.player2.avatar) }
            : { ...data.player2 };
        newMatchups[i] = { player1: patchedPlayer1, player2: patchedPlayer2 };
      }
    }
    setMatchups(newMatchups);
  };

  useEffect(() => {
    const fetchStage = async () => {
      const stage = await localforage.getItem("stage");
      if (stage) {
        setStageName(stage.name);
        setStageImage(stage.image);
        setStagePreview(stage.image ? URL.createObjectURL(stage.image) : null);
      }
    };
    fetchStage();
    fetchMatchups();
  }, []);

  return (
    <div className="setup container">
      <div className="content">
        <img className="logo" src={logo} alt="Jam Battle Logo" />
        <div className="matchups">
          <h1>Matchups</h1>
          <div className="rounds">
            <div className="left initial column">
              <div className="match match1">
                <h2>Match 1</h2>
                <div
                  className={`fighter fighter1}`}
                  style={
                    matchups[1]?.player1?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[1].player1.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[1]?.player1?.name || ""}</h3>
                </div>
                <div
                  className={`fighter fighter2}`}
                  style={
                    matchups[1]?.player2?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[1].player2.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[1]?.player2?.name || ""}</h3>
                </div>
                <button className="glow-btn setup-btn" onClick={() => handleMatchSetupOpen(1)}>
                  Setup
                </button>
              </div>
              <div className="match match2">
                <h2>Match 2</h2>
                <div
                  className={`fighter fighter1}`}
                  style={
                    matchups[2]?.player1?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[2].player1.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[2]?.player1?.name || ""}</h3>
                </div>
                <div
                  className={`fighter fighter2}`}
                  style={
                    matchups[2]?.player2?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[2].player2.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[2]?.player2?.name || ""}</h3>
                </div>
                <button className="glow-btn setup-btn" onClick={() => handleMatchSetupOpen(2)}>
                  Setup
                </button>
              </div>
            </div>
            <div className="right initial column">
              <div className="match match3">
                <h2>Match 3</h2>
                <div
                  className={`fighter fighter1}`}
                  style={
                    matchups[3]?.player1?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[3].player1.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[3]?.player1?.name || ""}</h3>
                </div>
                <div
                  className={`fighter fighter2}`}
                  style={
                    matchups[3]?.player2?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[3].player2.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[3]?.player2?.name || ""}</h3>
                </div>
                <button className="glow-btn setup-btn" onClick={() => handleMatchSetupOpen(3)}>
                  Setup
                </button>
              </div>
              <div className="match match4">
                <h2>Match 4</h2>
                <div
                  className={`fighter fighter1}`}
                  style={
                    matchups[4]?.player1?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[4].player1.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[4]?.player1?.name || ""}</h3>
                </div>
                <div
                  className={`fighter fighter2}`}
                  style={
                    matchups[4]?.player2?.avatarPreview
                      ? {
                          backgroundImage: `url(${matchups[4].player2.avatarPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "top",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  <h3>{matchups[4]?.player2?.name || ""}</h3>
                </div>
                <button className="glow-btn setup-btn" onClick={() => handleMatchSetupOpen(4)}>
                  Setup
                </button>
              </div>
            </div>
          </div>
          <Dialog
            className="dialog"
            fullWidth
            open={openMatchDialog}
            onClose={handleMatchSetupClose}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px 0 24px",
              }}
            >
              <h3 style={{ margin: 0 }}>Setup Match {selectedMatch}</h3>
              <IconButton aria-label="close" onClick={handleMatchSetupClose} size="large">
                <CloseIcon />
              </IconButton>
            </div>
            <DialogContent>
              <div style={{ display: "flex", gap: 32 }}>
                {[1, 2].map((player) => (
                  <div key={player} style={{ flex: 1 }}>
                    <p>
                      <strong>Player {player}</strong>
                    </p>
                    <TextField
                      label="Artist Name"
                      variant="outlined"
                      fullWidth
                      value={player === 1 ? player1.name : player2.name}
                      onChange={(e) => handlePlayerChange(player, "name", e.target.value)}
                      margin="normal"
                    />
                    <TextField
                      label="Instagram"
                      variant="outlined"
                      fullWidth
                      value={player === 1 ? player1.insta : player2.insta}
                      onChange={(e) => handlePlayerChange(player, "insta", e.target.value)}
                      margin="normal"
                    />
                    <div style={{ marginTop: 16 }}>
                      <p>Intro Song (wav or mp3):</p>
                      <input
                        accept="audio/wav, audio/mp3, audio/mpeg"
                        style={{ display: "none" }}
                        id={`intro-song-upload-${player}`}
                        type="file"
                        onChange={(e) => handlePlayerIntroSongChange(player, e)}
                      />
                      <label htmlFor={`intro-song-upload-${player}`}>
                        <Button variant="outlined" component="span">
                          Upload Intro Song
                        </Button>
                      </label>
                      {(player === 1 ? player1.introSong : player2.introSong) && (
                        <audio
                          controls
                          src={URL.createObjectURL(
                            player === 1 ? player1.introSong : player2.introSong
                          )}
                          style={{ display: "block", marginTop: 8, width: "100%" }}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <p>Avatar:</p>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id={`avatar-upload-${player}`}
                        type="file"
                        onChange={(e) => handlePlayerAvatarChange(player, e)}
                      />
                      <label htmlFor={`avatar-upload-${player}`}>
                        <Button variant="outlined" component="span">
                          Upload Avatar
                        </Button>
                      </label>
                      {(player === 1 ? player1.avatarPreview : player2.avatarPreview) && (
                        <div
                          style={{
                            border: "2px solid #ff4081",
                            borderRadius: 8,
                            padding: 8,
                            marginTop: 8,
                            background: "rgb(164 164 164)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 120,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={player === 1 ? player1.avatarPreview : player2.avatarPreview}
                            alt={`Avatar Preview Player ${player}`}
                            style={{
                              maxWidth: "100%",
                              maxHeight: 180,
                              borderRadius: 6,
                              display: "block",
                              marginBottom: "-20px",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleMatchSetupClear}>
                Clear
              </Button>
              <Button variant="contained" onClick={handleMatchSetupSave}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div className="stages">
          <h1>Stage</h1>
          <div
            className="stage"
            style={{
              backgroundImage: `url(${stagePreview})`,
            }}
          >
            <h3 className="stage-name">{stageName}</h3>
            <button className="glow-btn stage-btn" onClick={handleStageOpen}>
              Select Stage
            </button>
          </div>
          <Dialog className="dialog" fullWidth open={open} onClose={handleStageClear}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px 0 24px",
              }}
            >
              <h3 style={{ margin: 0 }}>Add Stage Details</h3>
              <IconButton aria-label="close" onClick={handleStageClose} size="large">
                <CloseIcon />
              </IconButton>
            </div>
            <DialogContent>
              <TextField
                label="Stage Name"
                variant="outlined"
                fullWidth
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                margin="normal"
              />
              <div style={{ marginTop: 16 }}>
                <p>Select an image:</p>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="stage-image-upload"
                  type="file"
                  onChange={handleStageImageChange}
                />
                <label htmlFor="stage-image-upload">
                  <Button variant="outlined" component="span">
                    Upload Image
                  </Button>
                </label>

                {stagePreview && (
                  <img
                    src={stagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      display: "block",
                      maxHeight: 320,
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleStageClear}>
                Clear
              </Button>
              <Button variant="contained" onClick={handleStageSave}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      {/* <button
        style={{
          position: "relative",
          zIndex: 99,
          cursor: "pointer",
          fontSize: 14,
          fontFamily: "monospace",
        }}
        onClick={requestPersistentStorage}
      >
        Enable Storage Persistence
      </button> */}
    </div>
  );
}
