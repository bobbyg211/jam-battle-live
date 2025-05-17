import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import matchups from "../json/matchups.json";
import randomFighter from "../assets/audio/randomizer-fighter.wav";
import chooseCharacter from "../assets/audio/choose-character.wav";

export default function Fighters() {
  const { matches } = matchups;
  const location = useLocation();
  let { fighter1, fighter2, match } = location.state || {};
  fighter1 = fighter1 || matches.match1.fighter1; // Replace with actual fighter name
  fighter2 = fighter2 || matches.match1.fighter2; // Replace with actual fighter name
  match = match || matches.match1.match; // Replace with actual match name
  const [currentFighter1, setCurrentFighter1] = useState(fighter1.name);
  const [currentFighter2, setCurrentFighter2] = useState(fighter2.name);
  const [isRandomizerFinished, setIsRandomizerFinished] = useState(false);

  useEffect(() => {
    const fighters = [
      "algonzo",
      "alpharedify",
      "ben-weiss",
      "chocolate-brown",
      "clint",
      "colin",
      "justin-kim",
      "malik",
      "nory",
      "og-mountain",
      "sam",
      "tim-lin",
      "wave-ali",
      "zain",
    ]; // Replace with actual fighter names

    const chooseCharacterAudio = new Audio(chooseCharacter); // Create audio object for chooseCharacter
    chooseCharacterAudio.preload = "auto"; // Preload the audio
    chooseCharacterAudio.autoplay = true; // Autoplay the audio
    chooseCharacterAudio.play().catch((err) => console.error("Audio playback failed:", err)); // Play the chooseCharacter sound immediately

    const randomFighterAudio = new Audio(randomFighter); // Create audio object for randomFighter
    randomFighterAudio.preload = "auto"; // Preload the audio
    randomFighterAudio.autoplay = true; // Autoplay the audio
    randomFighterAudio.play().catch((err) => console.error("Audio playback failed:", err)); // Play the randomFighter sound immediately

    let interval1: number | null = null;
    let interval2: number | null = null;

    interval1 = window.setInterval(() => {
      setCurrentFighter1(fighters[Math.floor(Math.random() * fighters.length)]);
    }, 100);

    interval2 = window.setInterval(() => {
      setCurrentFighter2(fighters[Math.floor(Math.random() * fighters.length)]);
    }, 100);

    setTimeout(() => {
      if (interval1 !== null) clearInterval(interval1);
      if (interval2 !== null) clearInterval(interval2);
      setCurrentFighter1(fighter1.name); // Set to original fighter1
      setCurrentFighter2(fighter2.name); // Set to original fighter2
      setIsRandomizerFinished(true); // Show the link
      randomFighterAudio.pause(); // Stop the randomFighter sound
      randomFighterAudio.currentTime = 0; // Reset the randomFighter sound
    }, 5000);

    return () => {
      if (interval1 !== null) clearInterval(interval1);
      if (interval2 !== null) clearInterval(interval2);
      randomFighterAudio.pause(); // Stop the randomFighter sound if component unmounts
      randomFighterAudio.currentTime = 0; // Reset the randomFighter sound
    };
  }, [fighter1, fighter2]);

  return (
    <div className="fighters container">
      <div className="content">
        <h1>Choose Your Fighters</h1>
        <div className="select-fighters">
          <div className={`fighter fighter1 ${currentFighter1}`}>
            <img src={`/src/assets/fighters/${currentFighter1}.png`} alt={currentFighter1} />
            <h2 className="name">{currentFighter1.replace(/-/g, " ")}</h2>
            <h3 className="player player1">Player 1</h3>
          </div>
          <div className={`fighter fighter2 ${currentFighter2}`}>
            <img src={`/src/assets/fighters/${currentFighter2}.png`} alt={currentFighter2} />
            <h2 className="name">{currentFighter2.replace(/-/g, " ")}</h2>
            <h3 className="player player2">Player 2</h3>
          </div>
        </div>
        <Link
          to="/battle"
          state={{
            fighter1,
            fighter2,
            match,
          }}
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
