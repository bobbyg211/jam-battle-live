import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import matchups from "../json/matchups.json";
import randomFighter from "../assets/audio/randomizer-fighter.wav";
import chooseCharacter from "../assets/audio/choose-character.wav";

// Import all fighter images and map them by name
const fighterImagesRaw = import.meta.glob("../assets/fighters/*.png", {
  eager: true,
  import: "default",
});
const imagesByName = Object.fromEntries(
  Object.entries(fighterImagesRaw).map(([path, url]) => {
    const name = path.split("/").pop().replace(".png", "");
    return [name, url];
  })
);

export default function Fighters() {
  const { matches } = matchups;
  const location = useLocation();
  let { fighter1, fighter2, match } = location.state || {};
  fighter1 = fighter1 || matches.match1.fighter1;
  fighter2 = fighter2 || matches.match1.fighter2;
  match = match || matches.match1.match;

  const [currentFighter1, setCurrentFighter1] = useState(fighter1.name);
  const [currentFighter2, setCurrentFighter2] = useState(fighter2.name);
  const [isRandomizerFinished, setIsRandomizerFinished] = useState(false);

  useEffect(() => {
    const fighters = [
      "algonzo",
      "alpharedify",
      "andrew-cheng",
      "ben-weiss",
      "chocolate-brown",
      "clint",
      "colin",
      "cramos",
      "george-ariza",
      "jay",
      "justin-kim",
      "malik",
      "nory",
      "og-mountain",
      "owen-chen",
      "sam",
      "sarah-anjali",
      "tim-lin",
      "wave-ali",
      "zain",
    ];

    const chooseCharacterAudio = new Audio(chooseCharacter);
    chooseCharacterAudio.preload = "auto";
    chooseCharacterAudio.autoplay = true;
    chooseCharacterAudio.play().catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Audio playback failed:", err);
      }
    });

    const randomFighterAudio = new Audio(randomFighter);
    randomFighterAudio.volume = 0.5;
    randomFighterAudio.preload = "auto";
    randomFighterAudio.autoplay = true;
    randomFighterAudio.play().catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Audio playback failed:", err);
      }
    });

    const interval1 = window.setInterval(() => {
      const randomName = fighters[Math.floor(Math.random() * fighters.length)];
      if (imagesByName[randomName]) setCurrentFighter1(randomName);
    }, 100);

    const interval2 = window.setInterval(() => {
      const randomName = fighters[Math.floor(Math.random() * fighters.length)];
      if (imagesByName[randomName]) setCurrentFighter2(randomName);
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
  }, [fighter1, fighter2]);

  return (
    <div className="fighters container">
      <div className="content">
        <h1>Choose Your Fighters</h1>
        <div className="select-fighters">
          <div className={`fighter fighter1 ${currentFighter1}`}>
            <img src={imagesByName[currentFighter1]} alt={currentFighter1} />
            <h2 className="name">{currentFighter1.replace(/-/g, " ")}</h2>
            <h3 className="player player1">Player 1</h3>
          </div>
          <div className={`fighter fighter2 ${currentFighter2}`}>
            <img src={imagesByName[currentFighter2]} alt={currentFighter2} />
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
