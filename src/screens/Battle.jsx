import { useLocation, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

// Import all audio and images eagerly as URLs
const fighterImages = import.meta.glob("../assets/fighters/*.png", {
  eager: true,
  import: "default",
});
const introsAudio = import.meta.glob("../assets/audio/intros/*.wav", {
  eager: true,
  import: "default",
});
const audioFiles = import.meta.glob("../assets/audio/*.wav", {
  eager: true,
  import: "default",
});

// Grab specific global sounds
const winnerAudioFile = audioFiles["../assets/audio/winner.wav"];
const impactClashAudioFile = audioFiles["../assets/audio/impact-clash.wav"];
const tenSecondLeftAudioFile = audioFiles["../assets/audio/10-seconds-left.wav"];
const newChampionAudioFile = audioFiles["../assets/audio/new-champion.wav"];

export default function Battle() {
  const time = 180;
  const location = useLocation();
  const { fighter1, fighter2, match } = location.state || {};
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(time);
  const timerRef = useRef(null);
  const [firstFighter, setFirstFighter] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [showRandomizer, setShowRandomizer] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const introAudioRef = useRef(null);

  const getFighterImage = (fighterName) => fighterImages[`../assets/fighters/${fighterName}.png`];

  const getIntroAudio = (audioFileName) => introsAudio[`../assets/audio/intros/${audioFileName}`];

  const toggleIntroAudio = (audioFile) => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
      introAudioRef.current = null;
    } else {
      const url = getIntroAudio(audioFile);
      if (url) {
        const audio = new Audio(url);
        introAudioRef.current = audio;
        audio.play().catch((err) => console.error("Audio playback failed:", err));
      }
    }
  };

  const handleWinnerClick = (winner) => {
    const url = match === 7 ? newChampionAudioFile : winnerAudioFile;
    const audio = new Audio(url);
    audio.play().catch((err) => console.error("Audio playback failed:", err));
    setWinner(winner);
  };

  const startCountdown = () => {
    if (!timerRef.current) {
      const oneSecondLeftAudio = new Audio(tenSecondLeftAudioFile);
      oneSecondLeftAudio.preload = "auto";
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 11 && isAudioEnabled) {
            oneSecondLeftAudio.play().catch((err) => console.error("Audio playback failed:", err));
          }
          if (prev > 0) {
            return prev - 1;
          } else {
            stopCountdown();
            return 0;
          }
        });
      }, 1000);
    }
  };

  const stopCountdown = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetCountdown = () => {
    stopCountdown();
    setTimeLeft(time);
  };

  const randomizeFirstFighter = () => {
    setIsRandomizing(true);
    let flipCount = 0;
    const flipInterval = setInterval(() => {
      setFirstFighter((prev) => (prev === fighter1.name ? fighter2.name : fighter1.name));
      flipCount++;
      if (flipCount >= 30) {
        clearInterval(flipInterval);
        setFirstFighter(Math.random() < 0.5 ? fighter1.name : fighter2.name);
        setIsRandomizing(false);
      }
    }, 100);
  };

  const handleMouseMove = (e) => {
    const { clientY, clientX } = e;
    const { innerWidth } = window;
    const isNearTopCenter =
      clientY < 150 && clientX > innerWidth / 2 - 200 && clientX < innerWidth / 2 + 200;
    setShowRandomizer(isNearTopCenter);
  };

  const handleMouseMoveForTimer = (e) => {
    const { clientY, clientX } = e;
    const { innerWidth, innerHeight } = window;
    const isNearBottomCenter =
      clientY > innerHeight - 200 &&
      clientX > innerWidth / 2 - 200 &&
      clientX < innerWidth / 2 + 200;
    if (timerRef.current) {
      setShowTimer(true);
    } else {
      setShowTimer(isNearBottomCenter);
    }
  };

  const handleMouseEnterRandomizer = () => setShowRandomizer(true);
  const handleMouseLeaveRandomizer = () => setShowRandomizer(false);
  const handleMouseEnterTimer = () => setShowTimer(true);
  const handleMouseLeaveTimer = () => {
    if (!timerRef.current) setShowTimer(false);
  };

  const stopIntroAudio = () => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
      introAudioRef.current = null;
    }
  };

  useEffect(() => {
    const impactAudio = new Audio(impactClashAudioFile);
    impactAudio.volume = 0.45;
    impactAudio.preload = "auto";
    impactAudio.play().catch((err) => console.error("Audio playback failed:", err));

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleMouseMoveForTimer);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseMoveForTimer);
      stopCountdown();
    };
  }, []);

  return (
    <div className="battle container">
      {/* Randomizer */}
      <div
        className={`randomizer ${showRandomizer && !winner ? "visible" : "hidden"}`}
        onMouseEnter={handleMouseEnterRandomizer}
        onMouseLeave={handleMouseLeaveRandomizer}
      >
        <h2>
          {isRandomizing
            ? `${firstFighter?.replace(/-/g, " ")}...`
            : firstFighter
            ? `${firstFighter.replace(/-/g, " ")} goes first`
            : "Who goes first?"}
        </h2>
        <button onClick={randomizeFirstFighter} className="glow-btn" disabled={isRandomizing}>
          {isRandomizing ? "Randomizing..." : "Randomize"}
        </button>
      </div>

      {/* Countdown Clock */}
      <div
        className={`countdown ${showTimer && !winner ? "visible" : "hidden"}`}
        onMouseEnter={handleMouseEnterTimer}
        onMouseLeave={handleMouseLeaveTimer}
        style={{ textAlign: "center" }}
      >
        <h2 className="countdown-timer">{timeLeft}</h2>
        <div className="countdown-controls">
          <button onClick={startCountdown} className="icon-btn">
            <FaPlay />
          </button>
          <button onClick={stopCountdown} className="icon-btn">
            <FaPause />
          </button>
          <button onClick={resetCountdown} className="icon-btn">
            <FaRedo />
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <input
              type="checkbox"
              checked={isAudioEnabled}
              onChange={(e) => setIsAudioEnabled(e.target.checked)}
            />
            Enable audio
          </label>
        </div>
      </div>

      {/* Fighters */}
      <div className={`content ${winner ? `winner-selected ${winner}` : ""}`}>
        <div className={`fighter fighter1 ${fighter1.name}`}>
          {winner === "fighter1" && (
            <>
              <div className="shine-circle"></div>
              <div className="shine-circle-secondary"></div>
            </>
          )}
          <img src={getFighterImage(fighter1.name)} alt={fighter1.name} />
          <h2 className="name">{fighter1.name.replace(/-/g, " ")}</h2>
          <span style={fighterLabelStyle("left")}>{fighter1.insta}</span>
          {!winner && (
            <button
              className="glow-btn intro-btn"
              onClick={() => toggleIntroAudio(`${fighter1.audio}.wav`)}
            >
              Intro
            </button>
          )}
          <h3 className="win player1">Winner</h3>
          {winner ? (
            <Link
              to="/bracket"
              state={{ match, winner: fighter1 }}
              className="glow-btn winner"
              onClick={stopIntroAudio}
            >
              {match !== 7 ? "Next match" : "Continue"}
            </Link>
          ) : (
            <button className="glow-btn winner" onClick={() => handleWinnerClick("fighter1")}>
              Winner
            </button>
          )}
        </div>

        {/* VS Divider */}
        <div className="vs">
          <div className="streaks">
            <svg
              className="pink-streak"
              xmlns="http://www.w3.org/2000/svg"
              width="423"
              height="768"
              viewBox="0 0 423 768"
              fill="none"
            >
              <path
                d="M261.699 0H423L190.5 768L0 768L261.699 0Z"
                fill="#FFB0B0"
                fillOpacity="0.68"
              />
            </svg>
            <svg
              className="white-streak"
              xmlns="http://www.w3.org/2000/svg"
              width="423"
              height="768"
              viewBox="0 0 423 768"
              fill="none"
            >
              <path d="M261.699 0H423L111.5 768L0 768L261.699 0Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          <h1>VS</h1>
        </div>

        <div className={`fighter fighter2 ${fighter2.name}`}>
          {winner === "fighter2" && (
            <>
              <div className="shine-circle"></div>
              <div className="shine-circle-secondary"></div>
            </>
          )}
          <img src={getFighterImage(fighter2.name)} alt={fighter2.name} />
          <h2 className="name">{fighter2.name.replace(/-/g, " ")}</h2>
          <span style={fighterLabelStyle("right")}>{fighter2.insta}</span>
          {!winner && (
            <button
              className="glow-btn intro-btn"
              onClick={() => toggleIntroAudio(`${fighter2.audio}.wav`)}
            >
              Intro
            </button>
          )}
          <h3 className="win player2">Winner</h3>
          {winner ? (
            <Link
              to="/bracket"
              state={{ match, winner: fighter2 }}
              className="glow-btn winner"
              onClick={stopIntroAudio}
            >
              {match !== 7 ? "Next match" : "Continue"}
            </Link>
          ) : (
            <button className="glow-btn winner" onClick={() => handleWinnerClick("fighter2")}>
              Winner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const fighterLabelStyle = (side) => ({
  fontWeight: 900,
  fontFamily: "sans-serif",
  fontSize: 28,
  position: "absolute",
  bottom: "40px",
  [side]: "50%",
  transform: side === "left" ? "translateX(-50%)" : "translateX(50%)",
});
