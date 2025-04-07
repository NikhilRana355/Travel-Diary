import React, { useEffect, useRef } from "react";

const Hyperspeed = ({ children }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let stars = Array(500).fill().map(() => ({
      x: Math.random() * w - w / 2,
      y: Math.random() * h - h / 2,
      z: Math.random() * w,
    }));

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      stars.forEach((star) => {
        star.z -= 4;
        if (star.z <= 0) {
          star.z = w;
          star.x = Math.random() * w - w / 2;
          star.y = Math.random() * h - h / 2;
        }

        const k = 128 / star.z;
        const px = star.x * k + w / 2;
        const py = star.y * k + h / 2;

        const size = (1 - star.z / w) * 3;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);

          ctx.shadowBlur = 8;
          ctx.shadowColor = "white";
          ctx.fillStyle = "white";
          ctx.fill();
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
      />
      {children}
    </div>
  );
};

export default Hyperspeed;
