import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { AssetsContext } from "../contexts/AssetsContext.jsx";
import matchups from "../json/matchups.json";

export default function Fighters() {
  const { assets } = useContext(AssetsContext);
  const { matches } = matchups;
  const location = useLocation();
  let { fighter1, fighter2, match } = location.state || {};
  fighter1 = fighter1 || matches.match1.fighter1;
  fighter2 = fighter2 || matches.match1.fighter2;
  match = match || 1;

  const [currentFighter1, setCurrentFighter1] = useState(fighter1.name);
  const [currentFighter2, setCurrentFighter2] = useState(fighter2.name);
  const [isRandomizerFinished, setIsRandomizerFinished] = useState(false);

  // Memoize fighter image map from assets
  const imagesByName = useMemo(() => {
    return Object.fromEntries(
      Object.entries(assets)
        .filter(([key]) => key.startsWith("fighters/") && key.endsWith(".png"))
        .map(([key, url]) => {
          const name = key.split("/").pop().replace(".png", "");
          return [name, url];
        })
    );
  }, [assets]);

  // Preload fighter images
  useEffect(() => {
    Object.values(imagesByName).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imagesByName]);

  useEffect(() => {
    const fighters = Object.keys(imagesByName);

    const chooseCharacterAudio = new Audio(assets["audio/choose-character.wav"]);
    chooseCharacterAudio.preload = "auto";
    chooseCharacterAudio.autoplay = true;
    chooseCharacterAudio.play().catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Audio playback failed:", err);
      }
    });

    const randomFighterAudio = new Audio(assets["audio/randomizer-fighter.wav"]);
    randomFighterAudio.volume = 0.5;
    randomFighterAudio.preload = "auto";
    randomFighterAudio.autoplay = true;
    randomFighterAudio.play().catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Audio playback failed:", err);
      }
    });

    const interval1 = setInterval(() => {
      const name = fighters[Math.floor(Math.random() * fighters.length)];
      if (imagesByName[name]) setCurrentFighter1(name);
    }, 100);

    const interval2 = setInterval(() => {
      const name = fighters[Math.floor(Math.random() * fighters.length)];
      if (imagesByName[name]) setCurrentFighter2(name);
    }, 100);

    setTimeout(() => {
      clearInterval(interval1);
      clearInterval(interval2);
      setCurrentFighter1(fighter1.name);
      setCurrentFighter2(fighter2.name);
      setIsRandomizerFinished(true);
      randomFighterAudio.pause();
      randomFighterAudio.currentTime = 0;
    }, 5000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      randomFighterAudio.pause();
      randomFighterAudio.currentTime = 0;
    };
  }, [assets, fighter1.name, fighter2.name, imagesByName]);

  return (
    <div className="fighters container">
      <div className="content">
        <h1>Choose Your Fighters</h1>
        <div className="select-fighters">
          <div className={`fighter fighter1 ${currentFighter1}`}>
            <img key={currentFighter1} src={imagesByName[currentFighter1]} alt={currentFighter1} />
            <h2 className="name">{currentFighter1.replace(/-/g, " ")}</h2>
            <h3 className="player player1">Player 1</h3>
          </div>
          <div className={`fighter fighter2 ${currentFighter2}`}>
            <img key={currentFighter2} src={imagesByName[currentFighter2]} alt={currentFighter2} />
            <h2 className="name">{currentFighter2.replace(/-/g, " ")}</h2>
            <h3 className="player player2">Player 2</h3>
          </div>
        </div>
        <Link
          to="/battle"
          state={{ fighter1, fighter2, match }}
          className="glow-btn"
          style={{
            marginTop: "20px",
            opacity: isRandomizerFinished ? 1 : 0,
            pointerEvents: isRandomizerFinished ? "auto" : "none",
          }}
        >
          Confirm
        </Link>
      </div>
    </div>
  );
}
