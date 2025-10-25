import { useEffect, useState, useContext } from "react";
import { StorageContext } from "../../contexts/StorageContext.jsx";
import { AssetsContext } from "../../contexts/AssetsContext.jsx";
import { Dialog, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import { Close, VideogameAsset } from "@mui/icons-material";
import { Link } from "react-router";
// import localforage from "localforage";

export default function Setup() {
  const { data, getValue, setValue, removeValue } = useContext(StorageContext);
  const { refreshAssets } = useContext(AssetsContext);
  const [open, setOpen] = useState(false);
  const [stageImage, setStageImage] = useState(null);
  const [stageName, setStageName] = useState("");
  const [stagePreview, setStagePreview] = useState(null);
  const [openCharacterDialog, setOpenCharacterDialog] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [character, setCharacter] = useState({
    id: null,
    name: "",
    insta: "",
    introSong: null,
    avatar: null,
    avatarPreview: null,
  });

  /* ========= STAGE ========== */

  const handleStageOpen = () => setOpen(true);
  const handleStageClose = () => setOpen(false);

  const handleStageClear = async () => {
    await removeValue("activeStage");
    refreshAssets();
    setStageName("");
    setStageImage(null);
    setStagePreview(null);
  };

  const handleStageSave = async () => {
    await setValue("activeStage", { name: stageName, image: stageImage });
    refreshAssets();
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

  /* ========= CHARACTERS ========== */

  const handleCharacterSetupOpen = async (charNum) => {
    const characters = await getValue("characters");
    if (characters) {
      setCharacter(
        characters[charNum] && characters[charNum].avatar
          ? {
              ...characters[charNum],
              id: charNum,
              avatarPreview: URL.createObjectURL(characters[charNum].avatar),
            }
          : { ...characters[charNum], id: charNum }
      );
    } else {
      setCharacter({
        id: charNum,
        name: "",
        insta: "",
        introSong: null,
        avatar: null,
        avatarPreview: null,
      });
    }

    setOpenCharacterDialog(true);
  };

  const handleCharacterSetupClose = () => {
    setOpenCharacterDialog(false);
  };

  const handleCharacterChange = (field, value) => {
    setCharacter((prev) => ({ ...prev, [field]: value }));
  };

  const handleCharacterAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setCharacter((prev) => ({ ...prev, avatar: file, avatarPreview: preview }));
    } else {
      setCharacter((prev) => ({ ...prev, avatar: null, avatarPreview: null }));
    }
  };

  const handleCharacterIntroSongChange = (e) => {
    const file = e.target.files[0];
    setCharacter((prev) => ({ ...prev, introSong: file }));
  };

  const handleCharacterSetupSave = async () => {
    await setValue("characters", {
      ...characters,
      [character.id]: character,
    });
    refreshAssets();
    setOpenCharacterDialog(false);
    setCharacter({
      id: null,
      name: "",
      insta: "",
      introSong: null,
      avatar: null,
      avatarPreview: null,
    });
    fetchCharacters();
  };

  const handleCharacterSetupClear = async () => {
    await setValue("characters", {
      ...characters,
      [character.id]: {
        id: character.id,
        name: "",
        insta: "",
        introSong: null,
        avatar: null,
        avatarPreview: null,
      },
    });
    refreshAssets();
    setCharacter({
      id: character.id,
      name: "",
      insta: "",
      introSong: null,
      avatar: null,
      avatarPreview: null,
    });
    fetchCharacters();
  };

  const fetchCharacters = async () => {
    const characters = await getValue("characters");
    if (characters) {
      const updatedCharacters = {};
      Object.entries(characters).forEach(([key, char]) => {
        updatedCharacters[key] = {
          ...char,
          avatarPreview: char.avatar ? URL.createObjectURL(char.avatar) : null,
        };
      });
      setCharacters(updatedCharacters);
    }
  };

  const fetchStage = async () => {
    const stage = await getValue("activeStage");
    if (stage) {
      setStageName(stage.name);
      setStageImage(stage.image);
      setStagePreview(stage.image ? URL.createObjectURL(stage.image) : null);
    }
  };

  useEffect(() => {
    fetchStage();
    fetchCharacters();
  }, [data]);

  return (
    <div className="bracket-setup container">
      <div className="content">
        <Link to="/admin/control">
          <IconButton className="icon control" aria-label="control">
            <VideogameAsset />
          </IconButton>
        </Link>
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
        <div className="characters">
          <h1>Characters</h1>
          <div className="character-list">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((charNum) => {
              return (
                <div className={`character character${charNum}`} key={charNum}>
                  <h2 style={{ fontFamily: "VT323", letterSpacing: "1px", marginBottom: 0 }}>
                    Character {charNum}
                  </h2>
                  <div
                    className="char-card"
                    style={
                      characters?.[charNum]?.avatarPreview
                        ? {
                            backgroundImage: `url(${characters?.[charNum].avatarPreview})`,
                            backgroundSize: "cover",
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                          }
                        : {}
                    }
                  >
                    <h3 style={{ fontFamily: "VT323", letterSpacing: "1px" }}>
                      {characters?.[charNum]?.name || ""}
                    </h3>
                  </div>
                  <button
                    className="glow-btn setup-btn"
                    onClick={() => handleCharacterSetupOpen(charNum)}
                  >
                    Setup
                  </button>
                </div>
              );
            })}
          </div>
          <Dialog
            className="dialog"
            fullWidth
            open={openCharacterDialog}
            onClose={handleCharacterSetupClose}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px 0 24px",
              }}
            >
              <h3 style={{ margin: 0 }}>Setup Character {character.id}</h3>
              <IconButton aria-label="close" onClick={handleCharacterSetupClose} size="large">
                <Close />
              </IconButton>
            </div>
            <DialogContent>
              <TextField
                label="Character Name"
                variant="outlined"
                fullWidth
                value={character.name}
                onChange={(e) => handleCharacterChange("name", e.target.value)}
                margin="normal"
              />
              <TextField
                label="Instagram"
                variant="outlined"
                fullWidth
                value={character.insta}
                onChange={(e) => handleCharacterChange("insta", e.target.value)}
                margin="normal"
              />
              <div style={{ marginTop: 16 }}>
                <p>Intro Song (wav or mp3):</p>
                <input
                  accept="audio/wav, audio/mp3, audio/mpeg"
                  style={{ display: "none" }}
                  id="intro-song-upload"
                  type="file"
                  onChange={(e) => handleCharacterIntroSongChange(e)}
                />
                <label htmlFor="intro-song-upload">
                  <Button variant="outlined" component="span">
                    Upload Intro Song
                  </Button>
                </label>
                {character.introSong && (
                  <audio
                    controls
                    src={URL.createObjectURL(character.introSong)}
                    style={{ display: "block", marginTop: 8, width: "100%" }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
              <div style={{ marginTop: 16, display: "flex" }}>
                <div style={{ marginRight: 24 }}>
                  <p>Avatar:</p>
                  <input
                    accept="image/jpeg, image/jpg, image/png"
                    style={{ display: "none" }}
                    id="avatar-upload"
                    type="file"
                    onChange={(e) => handleCharacterAvatarChange(e)}
                  />
                  <label htmlFor="avatar-upload">
                    <Button variant="outlined" component="span">
                      Upload Avatar
                    </Button>
                  </label>
                </div>
                {character.avatarPreview && (
                  <div
                    style={{
                      flex: 1,
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
                      src={character.avatarPreview}
                      alt="Avatar Preview"
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
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleCharacterSetupClear}>
                Clear
              </Button>
              <Button variant="contained" onClick={handleCharacterSetupSave}>
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
                <Close />
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
                  accept="image/jpeg, image/jpg, image/png"
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
    </div>
  );
}
