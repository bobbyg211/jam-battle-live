import { useEffect, useState, useContext } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StorageContext } from "../../contexts/StorageContext";

const DEFAULT_BRACKET = {
  rounds: [
    {
      name: "Quarterfinals",
      matches: [
        { id: 1, fighter1: null, fighter2: null, winner: null },
        { id: 2, fighter1: null, fighter2: null, winner: null },
        { id: 3, fighter1: null, fighter2: null, winner: null },
        { id: 4, fighter1: null, fighter2: null, winner: null },
      ],
    },
    {
      name: "Semifinals",
      matches: [
        { id: 5, fighter1: null, fighter2: null, winner: null },
        { id: 6, fighter1: null, fighter2: null, winner: null },
      ],
    },
    {
      name: "Final",
      matches: [{ id: 7, fighter1: null, fighter2: null, winner: null }],
    },
  ],
};

export default function Bracket({ availableFighters }) {
  const { setValue, getValue } = useContext(StorageContext);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBracket() {
      let stored = await getValue("bracket");
      if (!stored) {
        await setValue("bracket", DEFAULT_BRACKET);
        stored = DEFAULT_BRACKET;
      }
      setBracket(stored);
    }
    fetchBracket();
  }, [getValue, setValue]);

  const handleResetBracket = async () => {
    setLoading(true);
    await setValue("bracket", DEFAULT_BRACKET);
    setBracket(DEFAULT_BRACKET);
    setLoading(false);
  };

  // Handler to update fighter selection
  const handleFighterChange = (roundIdx, matchIdx, fighterKey, value) => {
    const updatedBracket = { ...bracket };
    updatedBracket.rounds = updatedBracket.rounds.map((round, rIdx) => {
      if (rIdx !== roundIdx) return round;
      return {
        ...round,
        matches: round.matches.map((match, mIdx) => {
          if (mIdx !== matchIdx) return match;
          return { ...match, [fighterKey]: value };
        }),
      };
    });
    setBracket(updatedBracket);
    setValue("bracket", updatedBracket);
  };

  return (
    <div className="control-bracket">
      {bracket && (
        <div className="bracket-display">
          {bracket.rounds.map((round, roundIdx) => (
            <div className="round" key={round.name}>
              <h3>{round.name}</h3>
              {round.matches.map((match, matchIdx) => (
                <div className="match" key={match.id}>
                  <div className="fighter fighter1">
                    <FormControl
                      variant="outlined"
                      size="medium"
                      style={{ minWidth: 220, position: "relative" }}
                    >
                      <InputLabel style={{ color: "#fff", fontSize: 20 }}>Fighter 1</InputLabel>
                      <Select
                        label="Fighter 1"
                        value={match.fighter1 || ""}
                        onChange={(e) =>
                          handleFighterChange(roundIdx, matchIdx, "fighter1", e.target.value)
                        }
                        renderValue={(selected) => {
                          if (!selected)
                            return (
                              <span style={{ color: "#fff", fontSize: 20, opacity: 0.8 }}>TBD</span>
                            );
                          const fighter = availableFighters.find((f) => f.id === selected);
                          if (!fighter)
                            return <span style={{ color: "#fff", fontSize: 20 }}>Unknown</span>;
                          return (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={fighter.avatarPreview}
                                alt={fighter.name}
                                style={{
                                  width: "auto",
                                  height: 40,
                                  borderRadius: "50%",
                                  marginRight: 10,
                                }}
                              />
                              <span
                                style={{
                                  color: "#fff",
                                  fontSize: 20,
                                  fontFamily: "VT323, monospace",
                                }}
                              >
                                {fighter.name}
                              </span>
                            </span>
                          );
                        }}
                        sx={{
                          color: "#fff",
                          fontSize: 20,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                          "& .MuiSelect-icon": { color: "#fff", fontSize: 28 },
                          background: "transparent",
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              backgroundColor: "#222",
                              color: "#fff",
                              fontSize: 20,
                            },
                          },
                        }}
                      >
                        {availableFighters.map((f) => (
                          <MenuItem
                            key={f.id}
                            value={f.id}
                            style={{
                              color: "#fff",
                              backgroundColor: "#222",
                              display: "flex",
                              alignItems: "center",
                              fontSize: 20,
                              height: 60,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <img
                                src={f.avatarPreview}
                                alt={f.name}
                                style={{ width: "auto", height: 40, borderRadius: "50%" }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={f.name}
                              sx={{ color: "#fff", fontSize: 20, fontFamily: "VT323, monospace" }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                      {match.fighter1 && (
                        <IconButton
                          aria-label="Clear selection"
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFighterChange(roundIdx, matchIdx, "fighter1", null);
                          }}
                          sx={{
                            position: "absolute",
                            right: 36,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#fff",
                            background: "black",
                            opacity: 1,
                            height: "calc(100% - 2px)",
                            "&:hover": { opacity: 1 },
                            zIndex: 2,
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </FormControl>
                  </div>
                  <div className="vs">vs</div>
                  <div className="fighter fighter2">
                    <FormControl
                      variant="outlined"
                      size="medium"
                      style={{ minWidth: 220, position: "relative" }}
                    >
                      <InputLabel style={{ color: "#fff", fontSize: 20 }}>Fighter 2</InputLabel>
                      <Select
                        label="Fighter 2"
                        value={match.fighter2 || ""}
                        onChange={(e) =>
                          handleFighterChange(roundIdx, matchIdx, "fighter2", e.target.value)
                        }
                        renderValue={(selected) => {
                          if (!selected)
                            return (
                              <span style={{ color: "#fff", fontSize: 20, opacity: 0.8 }}>TBD</span>
                            );
                          const fighter = availableFighters.find((f) => f.id === selected);
                          if (!fighter)
                            return <span style={{ color: "#fff", fontSize: 20 }}>Unknown</span>;
                          return (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={fighter.avatarPreview}
                                alt={fighter.name}
                                style={{
                                  width: "auto",
                                  height: 40,
                                  borderRadius: "50%",
                                  marginRight: 10,
                                }}
                              />
                              <span
                                style={{
                                  color: "#fff",
                                  fontSize: 20,
                                  fontFamily: "VT323, monospace",
                                }}
                              >
                                {fighter.name}
                              </span>
                            </span>
                          );
                        }}
                        sx={{
                          color: "#fff",
                          fontSize: 20,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                          "& .MuiSelect-icon": { color: "#fff", fontSize: 28 },
                          background: "transparent",
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              backgroundColor: "#222",
                              color: "#fff",
                              fontSize: 20,
                            },
                          },
                        }}
                      >
                        {availableFighters.map((f) => (
                          <MenuItem
                            key={f.id}
                            value={f.id}
                            style={{
                              color: "#fff",
                              backgroundColor: "#222",
                              display: "flex",
                              alignItems: "center",
                              fontSize: 20,
                              height: 60,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <img
                                src={f.avatarPreview}
                                alt={f.name}
                                style={{ width: "auto", height: 40, borderRadius: "50%" }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={f.name}
                              sx={{ color: "#fff", fontSize: 20, fontFamily: "VT323, monospace" }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                      {match.fighter2 && (
                        <IconButton
                          aria-label="Clear selection"
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFighterChange(roundIdx, matchIdx, "fighter2", null);
                          }}
                          sx={{
                            position: "absolute",
                            right: 36,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#fff",
                            opacity: 0.8,
                            "&:hover": { opacity: 1 },
                            zIndex: 2,
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </FormControl>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <Button
        variant="contained"
        className="pill-btn purple reset"
        onClick={handleResetBracket}
        disabled={loading}
        style={{ marginBottom: 16 }}
      >
        {loading ? "Resetting..." : "Reset Bracket"}
      </Button>
    </div>
  );
}
