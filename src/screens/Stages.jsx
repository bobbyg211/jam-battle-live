import { Link } from "react-router";
import { useEffect, useState, useContext } from "react";
import { AssetsContext } from "../contexts/AssetsContext.jsx";
import localforage from "localforage";

export default function Stages() {
  const { assets } = useContext(AssetsContext);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [customStageName, setCustomStageName] = useState(null);

  useEffect(() => {
    localforage.getItem("stage").then((stage) => {
      if (stage && stage.name) setCustomStageName(stage.name);
    });
  }, []);

  // Build the full stage list with static and dynamic assets
  const stages = [
    { title: "Mt. Everest", img: assets["stages/mt-everest.jpg"] },
    { title: "Saturn", img: assets["stages/saturn.jpg"] },
    { title: customStageName, img: assets["stage"] }, // dynamic from localForage
    { title: "Amazon Rainforest", img: assets["stages/amazon-rainforest.jpg"] },
    { title: "Sahara Desert", img: assets["stages/sahara-desert.jpg"] },
    { title: "Bermuda Triangle", img: assets["stages/bermuda-triangle.jpg"] },
  ];

  useEffect(() => {
    if (!assets["audio/randomizer-stage.wav"]) return;

    let elapsed = 0;
    const audio = new Audio(assets["audio/randomizer-stage.wav"]);
    audio.preload = "auto";
    audio.loop = true;
    audio.play().catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Audio playback failed:", err);
      }
    });

    const interval = setInterval(() => {
      elapsed += 200;
      if (elapsed >= 7000) {
        setHighlightedIndex(2); // Always end on custom stage
        clearInterval(interval);
        audio.pause();
        audio.currentTime = 0;
      } else {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * stages.length);
        } while (randomIndex === highlightedIndex);
        setHighlightedIndex(randomIndex);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [assets]);

  return (
    <div className="stages container">
      <div className="content">
        <h1>Choose Your Stage</h1>
        <div className="stages-list">
          {stages.map((stage, index) => (
            <Link
              key={index}
              to="/fighters"
              className={`stage ${highlightedIndex === index ? "highlighted" : ""}`}
              style={{
                backgroundImage: `url(${stage.img})`,
              }}
            >
              <h2 className="name">{stage.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
