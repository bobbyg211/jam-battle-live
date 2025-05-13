import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Stages() {
  const stages = [
    { title: "Mt. Everest", img: "src/assets/stages/mt-everest.jpg" },
    { title: "Saturn", img: "src/assets/stages/saturn.jpg" },
    { title: "McKibbin Lofts", img: "src/assets/stages/mckibbin-lofts.jpg" },
    { title: "Amazon Rainforest", img: "src/assets/stages/amazon-rainforest.jpg" },
    { title: "Sahara Desert", img: "src/assets/stages/sahara-desert.jpg" },
    { title: "Bermuda Triangle", img: "src/assets/stages/bermuda-triangle.jpg" },
  ];

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    let elapsed = 0;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      elapsed += 200; // Update elapsed time by 200ms
      if (elapsed >= 7000) {
        setHighlightedIndex(2); // Ensure it ends on "McKibbin Lofts"
        clearInterval(interval);
      } else {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * stages.length);
        } while (randomIndex === highlightedIndex);
        setHighlightedIndex(randomIndex);
      }
    }, 100); // Set interval to 200ms

    return () => clearInterval(interval);
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
              style={{ backgroundImage: `url(${stage.img})` }}
            >
              <h2 className="name">{stage.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
