import { Button } from "@mui/material";
import React, { useState, useRef } from "react";

export default function CoinFlip({ player1, player2 }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState(0); // in deg, accumulates
  const [scale, setScale] = useState(1);
  const animationRef = useRef();

  const flipCoin = () => {
    if (isFlipping) return;
    const isHeads = Math.random() < 0.5;
    const turns = 6 + Math.floor(Math.random() * 3); // 6, 7, or 8
    const final = isHeads ? 0 : 180;
    const duration = 1500;
    const start = performance.now();
    const initialRotation = rotation;
    const totalRotation = turns * 360 + (final - (((initialRotation % 360) + 360) % 360));
    setIsFlipping(true);

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Linear progress for constant speed
      setRotation(initialRotation + totalRotation * progress);
      // Scale follows a linear arc: 1 → 1.7 → 1
      // We'll use a parabola for scale: peak at middle
      setScale(1 + 0.7 * (1 - 4 * (progress - 0.5) * (progress - 0.5)));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsFlipping(false);
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <style>{`
        .coin3d-perspective {
          perspective: 900px;
          position: relative;
          z-index: 2;
        }
        .coin3d {
          width: 120px;
          height: 120px;
          position: relative;
          transform-style: preserve-3d;
          transition: none;
          border: 5px solid white;
          border-radius: 50%;
        }
        .coin3d-face {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          border-radius: 50%;
          backface-visibility: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .coin3d-heads {
          background: #AC8DF2;
          color: #000;
          transform: rotateX(0deg) translateZ(8px);
        }
        .coin3d-tails {
          background: #99DBED;
          color: #000;
          transform: rotateX(180deg) translateZ(8px);
        }
      `}</style>
      <div className="coin3d-perspective" style={{ width: 120, height: 120, margin: "32px 0" }}>
        <div className="coin3d" style={{ transform: `rotateX(${rotation}deg) scale(${scale})` }}>
          <div className="coin3d-face coin3d-heads">{player1}</div>
          <div className="coin3d-face coin3d-tails">{player2}</div>
        </div>
      </div>
      <Button onClick={flipCoin} className="pill-btn green" variant="contained">
        Flip Coin
      </Button>
    </div>
  );
}
