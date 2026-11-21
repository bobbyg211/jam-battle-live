import { useState, useEffect, useContext, useMemo } from "react";
import { StorageContext } from "../../contexts/StorageContext.jsx";
import { AssetsContext } from "../../contexts/AssetsContext.jsx";

export default function Fighters() {
  const { assets } = useContext(AssetsContext);
  const { data, getValue } = useContext(StorageContext);
  const [activeFighters, setActiveFighters] = useState({});

  useEffect(() => {
    const fetchActiveFighters = async () => {
      const availableFighters = await getValue("characters");
      const activeFighters = await getValue("activeFighters");
      let fighter1Obj = activeFighters?.fighter1
        ? Object.values(availableFighters).find((f) => f.id === activeFighters.fighter1)
        : null;

      let fighter2Obj = activeFighters?.fighter2
        ? Object.values(availableFighters).find((f) => f.id === activeFighters.fighter2)
        : null;

      // Generate new blobs for avatarPreview if avatar exists and is a Blob
      if (
        fighter1Obj &&
        fighter1Obj.avatar &&
        typeof fighter1Obj.avatar === "object" &&
        fighter1Obj.avatar instanceof Blob
      ) {
        fighter1Obj = { ...fighter1Obj, avatarPreview: URL.createObjectURL(fighter1Obj.avatar) };
      }
      if (
        fighter2Obj &&
        fighter2Obj.avatar &&
        typeof fighter2Obj.avatar === "object" &&
        fighter2Obj.avatar instanceof Blob
      ) {
        fighter2Obj = { ...fighter2Obj, avatarPreview: URL.createObjectURL(fighter2Obj.avatar) };
      }
      setActiveFighters({ fighter1: fighter1Obj, fighter2: fighter2Obj });
    };
    fetchActiveFighters();
  }, [data]);

  const [currentFighter1, setCurrentFighter1] = useState(activeFighters.fighter1);
  const [currentFighter2, setCurrentFighter2] = useState(activeFighters.fighter2);

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
      setCurrentFighter1(activeFighters.fighter1);
      setCurrentFighter2(activeFighters.fighter2);
      randomFighterAudio.pause();
      randomFighterAudio.currentTime = 0;
    }, 5000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      randomFighterAudio.pause();
      randomFighterAudio.currentTime = 0;
    };
  }, [assets, activeFighters.fighter1, activeFighters.fighter2, imagesByName]);

  return (
    <div className="fighters container">
      <div className="content">
        <h1>Choose Your Fighters</h1>
        <div className="select-fighters">
          <div className={`fighter fighter1 ${currentFighter1}`}>
            <img
              key={currentFighter1?.name || currentFighter1}
              src={currentFighter1?.avatarPreview || imagesByName[currentFighter1]}
              alt={currentFighter1?.name || currentFighter1}
            />
            <h2 className="name">{currentFighter1?.name || currentFighter1?.replace(/-/g, " ")}</h2>
            <h3 className="player player1">Player 1</h3>
          </div>
          <div className={`fighter fighter2 ${currentFighter2}`}>
            <img
              key={currentFighter2?.name || currentFighter2}
              src={currentFighter2?.avatarPreview || imagesByName[currentFighter2]}
              alt={currentFighter2?.name || currentFighter2}
            />
            <h2 className="name">{currentFighter2?.name || currentFighter2?.replace(/-/g, " ")}</h2>
            <h3 className="player player2">Player 2</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
