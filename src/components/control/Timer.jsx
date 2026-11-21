import { useState, useEffect, useRef, useContext } from "react";
import { Input, IconButton } from "@mui/material";
import { RestartAlt, PlayCircleOutline, PauseCircleOutline, Edit } from "@mui/icons-material";
import { StorageContext } from "../../contexts/StorageContext.jsx";

export default function Timer() {
  const { data, getValue, setValue } = useContext(StorageContext);
  const [editMode, setEditMode] = useState(false);
  const [duration, setDuration] = useState(120);
  const [time, setTime] = useState(120);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const saveTime = (newTime) => {
    const intTime = parseInt(newTime, 10);
    if (!isNaN(intTime) && intTime >= 0 && intTime <= 5999) {
      setTime(intTime);
      setValue("timerDuration", intTime);
    }
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
    const fetchTimer = async () => {
      const duration = await getValue("timerDuration");
      if (duration) {
        setDuration(duration);
        setTime(duration);
      }
    };
    fetchTimer();
  }, [data]);

  return (
    <div className="timer">
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

        {editMode ? (
          <div className="clock">
            <Input
              className="time-input"
              type="number"
              inputProps={{ min: 0, max: 5999 }}
              value={time}
              onChange={(e) => saveTime(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditMode(false);
                  saveTime(e.target.value);
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <h3 className="clock">{time}</h3>
        )}

        <IconButton
          className="icon edit-time"
          aria-label="edit"
          style={{ display: editMode ? "none" : "flex" }}
          onClick={() => {
            setEditMode(true);
            setRunning(false);
          }}
        >
          <Edit />
        </IconButton>
      </div>
      <div className={`play-restart ${editMode ? "disabled" : ""}`}>
        <IconButton className="icon play" aria-label="play" onClick={() => setRunning(!running)}>
          {running ? <PauseCircleOutline /> : <PlayCircleOutline />}
        </IconButton>
        <IconButton
          className="icon restart"
          aria-label="restart"
          onClick={() => {
            setRunning(false);
            setTime(duration);
          }}
        >
          <RestartAlt />
        </IconButton>
      </div>
    </div>
  );
}
