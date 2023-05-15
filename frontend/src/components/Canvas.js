import React, { useEffect, useRef } from 'react';

const ComplexGradientAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frame;

    const animateGradient = (timestamp) => {
      const progress = timestamp / 1000;
      const gradient1 = context.createRadialGradient(
        canvas.width / 2 + Math.sin(progress) * canvas.width / 3,
        canvas.height / 2 + Math.cos(progress) * canvas.height / 3,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );

      const gradient2 = context.createRadialGradient(
        canvas.width / 2 - Math.sin(progress) * canvas.width / 3,
        canvas.height / 2 - Math.cos(progress) * canvas.height / 3,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );

      gradient1.addColorStop(0, 'rgba(169, 96, 238, 1)');
      gradient1.addColorStop(0.33, 'rgba(255, 51, 61, 1)');
      gradient1.addColorStop(0.66, 'rgba(144, 224, 255, 1)');
      gradient1.addColorStop(1, 'rgba(255, 203, 87, 1)');

      gradient2.addColorStop(0, 'rgba(255, 203, 87, 1)');
      gradient2.addColorStop(0.33, 'rgba(144, 224, 255, 1)');
      gradient2.addColorStop(0.66, 'rgba(255, 51, 61, 1)');
      gradient2.addColorStop(1, 'rgba(169, 96, 238, 1)');

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = gradient1;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = gradient2;
      context.globalAlpha = 0.5;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1.0;

      frame = requestAnimationFrame(animateGradient);
    };

    frame = requestAnimationFrame(animateGradient);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0% 100%)',
      }}
    />
  );
};

export default ComplexGradientAnimation;
