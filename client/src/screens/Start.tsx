import { useState } from "react";
import logo from "../assets/jam-battle-logo.png";
import ghVideo from "../assets/Guitar Hero 3 - Intro.mp4";

export default function Start() {
  const [showVideo, setShowVideo] = useState(false);

  const handleEnterArena = () => {
    setShowVideo(true);
    const videoElement = document.querySelector(".video-overlay video") as HTMLVideoElement;
    if (videoElement) {
      setTimeout(() => {
        videoElement.play();
      }, 1500);
    }
  };

  return (
    <div className="start container">
      <div className="content">
        <img src={logo} alt="Jam Battle Logo" />
        <h1>8 Artists. 3 Judges. 1 Winner.</h1>
        <button className="start-btn" onClick={handleEnterArena}>
          Press Start
        </button>
      </div>

      <div className={`video-overlay ${showVideo ? "active" : ""}`}>
        <video>
          <source src={ghVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
