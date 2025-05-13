import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa"; // Import icons

export default function Battle() {
  const location = useLocation();
  const { fighter1, fighter2, match } = location.state || {};
  const [winner, setWinner] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // Countdown starts at 60 seconds
  const timerRef = useRef<number | null>(null); // Use number type for timer ID
  const [firstFighter, setFirstFighter] = useState<string | null>(null); // Fighter who goes first
  const [isRandomizing, setIsRandomizing] = useState(false); // Randomizing state
  const [showRandomizer, setShowRandomizer] = useState(false); // Show/hide randomizer
  const [showTimer, setShowTimer] = useState(false); // Show/hide timer

  const handleWinnerClick = (winner: string) => {
    setWinner(winner);
  };

  const startCountdown = () => {
    if (!timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
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
    setTimeLeft(60);
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

  const handleMouseMove = (e: MouseEvent) => {
    const { clientY, clientX } = e; // Use MouseEvent properties
    const { innerWidth } = window;
    const isNearTopCenter =
      clientY < 150 && clientX > innerWidth / 2 - 200 && clientX < innerWidth / 2 + 200;
    setShowRandomizer(isNearTopCenter);
  };

  const handleMouseMoveForTimer = (e: MouseEvent) => {
    const { clientY, clientX } = e; // Use MouseEvent properties
    const { innerWidth, innerHeight } = window;
    const isNearBottomCenter =
      clientY > innerHeight - 200 &&
      clientX > innerWidth / 2 - 200 &&
      clientX < innerWidth / 2 + 200;
    if (timerRef.current) {
      setShowTimer(true); // Always show timer when running
    } else {
      setShowTimer(isNearBottomCenter); // Show timer only when in activation area if not running
    }
  };

  const handleMouseEnterRandomizer = () => {
    setShowRandomizer(true); // Keep randomizer visible when hovering over it
  };

  const handleMouseLeaveRandomizer = () => {
    setShowRandomizer(false); // Hide randomizer when leaving it
  };

  const handleMouseEnterTimer = () => {
    setShowTimer(true); // Keep timer visible when hovering over it
  };

  const handleMouseLeaveTimer = () => {
    if (!timerRef.current) {
      setShowTimer(false); // Hide timer only if not running
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleMouseMoveForTimer);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseMoveForTimer);
      stopCountdown(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div className={`battle container`}>
      {/* Randomizer */}
      <div
        className={`randomizer ${showRandomizer && !winner ? "visible" : "hidden"}`} // Hide if a winner is selected
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

      {/* Countdown clock */}
      <div
        className={`countdown ${showTimer && !winner ? "visible" : "hidden"}`} // Hide if a winner is selected
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
      </div>
      <div className={`content ${winner ? `winner-selected ${winner}` : ""}`}>
        <div className={`fighter fighter1 ${fighter1.name}`}>
          {winner === "fighter1" && (
            <>
              <div className="shine-circle"></div>
              <div className="shine-circle-secondary"></div>
            </>
          )}
          <img src={`/src/assets/fighters/${fighter1.name}.png`} alt={fighter1.name} />
          <h2 className="name">{fighter1.name.replace(/-/g, " ")}</h2>
          <span
            style={{
              fontWeight: 900,
              fontFamily: "sans-serif",
              fontSize: 28,
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {fighter1.insta}
          </span>
          <h3 className="win player1">Winner</h3>
          {winner ? (
            <>
              {match !== 7 ? (
                <Link to="/bracket" state={{ match, winner: fighter1 }} className="glow-btn winner">
                  Next match
                </Link>
              ) : (
                <Link to="/bracket" state={{ match, winner: fighter1 }} className="glow-btn winner">
                  Continue
                </Link>
              )}
            </>
          ) : (
            <button className="glow-btn winner" onClick={() => handleWinnerClick("fighter1")}>
              Winner
            </button>
          )}
        </div>
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
                fill-opacity="0.68"
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
              <path d="M261.699 0H423L111.5 768L0 768L261.699 0Z" fill="white" fill-opacity="0.8" />
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
          <img src={`/src/assets/fighters/${fighter2.name}.png`} alt={fighter2.name} />
          <h2 className="name">{fighter2.name.replace(/-/g, " ")}</h2>
          <span
            style={{
              fontWeight: 900,
              fontFamily: "sans-serif",
              fontSize: 28,
              position: "absolute",
              bottom: "40px",
              right: "50%",
              transform: "translateX(50%)",
            }}
          >
            {fighter1.insta}
          </span>
          <h3 className="win player2">Winner</h3>
          {winner ? (
            <>
              {match !== 7 ? (
                <Link to="/bracket" state={{ match, winner: fighter2 }} className="glow-btn winner">
                  Next match
                </Link>
              ) : (
                <Link to="/bracket" state={{ match, winner: fighter2 }} className="glow-btn winner">
                  Continue
                </Link>
              )}
            </>
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
