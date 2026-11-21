import { useEffect, useContext, useState } from "react";
import { StorageContext } from "../../contexts/StorageContext.jsx";

const audioFiles = import.meta.glob("../assets/audio/*.wav", {
  eager: true,
  import: "default",
});

// Grab specific global sounds
const impactClashAudioFile = audioFiles["../assets/audio/impact-clash.wav"];

export default function Battle() {
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

  useEffect(() => {
    const impactAudio = new Audio(impactClashAudioFile);
    impactAudio.volume = 0.45;
    impactAudio.preload = "auto";
    impactAudio.play().catch((err) => console.error("Audio playback failed:", err));
  }, []);

  if (!activeFighters.fighter1 || !activeFighters.fighter2) {
    return <div>Loading fighters...</div>;
  }

  return (
    <div className="battle container">
      {/* Fighters */}
      <div className={"content"}>
        <div className={`fighter fighter1 ${activeFighters.fighter1.name}`}>
          <img src={activeFighters.fighter1.avatarPreview} alt={activeFighters.fighter1.name} />
          <h2 className="name">{activeFighters.fighter1.name.replace(/-/g, " ")}</h2>
          <span style={fighterLabelStyle("left")}>{activeFighters.fighter1.insta}</span>
          {/* Winner UI removed */}
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

        <div className={`fighter fighter2 ${activeFighters.fighter2.name}`}>
          <img src={activeFighters.fighter2.avatarPreview} alt={activeFighters.fighter2.name} />
          <h2 className="name">{activeFighters.fighter2.name.replace(/-/g, " ")}</h2>
          <span style={fighterLabelStyle("right")}>{activeFighters.fighter2.insta}</span>
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

{
  /* <div className="shine-circle"></div>
<div className="shine-circle-secondary"></div> */
}
