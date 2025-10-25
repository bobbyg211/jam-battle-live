import { useEffect, useState, useContext } from "react";
import { StorageContext } from "../../contexts/StorageContext.jsx";
import { AssetsContext } from "../../contexts/AssetsContext.jsx";

export default function Stages() {
  const { data, getValue } = useContext(StorageContext);
  const { assets } = useContext(AssetsContext);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [customStageName, setCustomStageName] = useState(null);
  const [customStageImage, setCustomStageImage] = useState(null);

  useEffect(() => {
    const fetchCustomStageName = async () => {
      const stage = await getValue("activeStage");
      if (stage && stage.name) {
        setCustomStageName(stage.name);
        setCustomStageImage(stage.image ? URL.createObjectURL(stage.image) : null);
      }
    };
    fetchCustomStageName();
  }, [data]);

  // Build the full stage list with static and dynamic assets
  const stages = [
    { title: "Mt. Everest", img: assets["stages/mt-everest.jpg"] },
    { title: "Saturn", img: assets["stages/saturn.jpg"] },
    { title: customStageName, img: customStageImage }, // dynamic from localForage
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
            <div
              key={index}
              className={`stage ${highlightedIndex === index ? "highlighted" : ""}`}
              style={{
                backgroundImage: `url(${stage.img})`,
              }}
            >
              <h2 className="name">{stage.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
