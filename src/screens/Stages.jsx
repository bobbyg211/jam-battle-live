import { Link } from "react-router";
import { useEffect, useState } from "react";
import randomizerStageAudio from "../assets/audio/randomizer-stage.wav";

// Import all stage images eagerly as URLs
const stageImages = import.meta.glob("../assets/stages/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

export default function Stages() {
  // Match each stage title to its corresponding imported image
  const stages = [
    { title: "Mt. Everest", img: stageImages["../assets/stages/mt-everest.jpg"] },
    { title: "Saturn", img: stageImages["../assets/stages/saturn.jpg"] },
    { title: "McKibbin Lofts", img: stageImages["../assets/stages/mckibbin-lofts.jpg"] },
    { title: "Amazon Rainforest", img: stageImages["../assets/stages/amazon-rainforest.jpg"] },
    { title: "Sahara Desert", img: stageImages["../assets/stages/sahara-desert.jpg"] },
    { title: "Bermuda Triangle", img: stageImages["../assets/stages/bermuda-triangle.jpg"] },
  ];

  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    let elapsed = 0;
    const audio = new Audio(randomizerStageAudio);
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
        setHighlightedIndex(2); // Always end on "McKibbin Lofts"
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
  }, []);

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
