import { useState, useEffect, useContext } from "react";
import { StorageContext } from "../../contexts/StorageContext.jsx";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const GENRES = ["Electric", "Hip Hop", "Rock", "Jazz", "Pop", "Electronic"];

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

export default function GenreKey() {
  const { data, setValue } = useContext(StorageContext);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const handleSetGenre = async (val) => {
    setSelectedGenre(val);
    await setValue("genre", val);
  };

  const handleSetKey = async (val) => {
    setSelectedKey(val);
    await setValue("key", val);
  };

  useEffect(() => {
    if (data.genre) {
      setSelectedGenre(data.genre);
    }
    if (data.key) {
      setSelectedKey(data.key);
    }
  }, [data.genre, data.key]);

  return (
    <div className="genre-key">
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
            labelId="key-select-label"
            value={selectedGenre}
            label="Key"
            onChange={(e) => handleSetGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedGenre && <div className="genre-display">{selectedGenre}</div>}
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
            onChange={(e) => handleSetKey(e.target.value)}
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
  );
}
