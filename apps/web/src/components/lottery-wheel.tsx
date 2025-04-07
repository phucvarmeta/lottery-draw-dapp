'use client';

import { useEffect, useRef } from 'react';

interface LotteryWheelProps {
  winningNumber: number;
}

export default function LotteryWheel({ winningNumber }: LotteryWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Colors for the wheel segments
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#C9CBCF',
      '#7BC8A4',
      '#E7E9ED',
      '#1E88E5',
    ];

    // Draw the wheel
    const drawWheel = (rotation: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw wheel segments
      const segmentAngle = (2 * Math.PI) / 10;

      for (let i = 0; i < 10; i++) {
        const startAngle = rotation + i * segmentAngle;
        const endAngle = rotation + (i + 1) * segmentAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.fill();

        // Draw number
        ctx.save();
        ctx.translate(
          centerX + radius * 0.7 * Math.cos(startAngle + segmentAngle / 2),
          centerY + radius * 0.7 * Math.sin(startAngle + segmentAngle / 2)
        );
        ctx.rotate(startAngle + segmentAngle / 2 + Math.PI / 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((i + 1).toString(), 0, 0);

        ctx.restore();
      }

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius - 10);
      ctx.lineTo(centerX - 10, centerY - radius + 10);
      ctx.lineTo(centerX + 10, centerY - radius + 10);
      ctx.closePath();
      ctx.fillStyle = '#FF0000';
      ctx.fill();
    };

    // Animate the wheel
    let currentRotation = 0;
    let targetRotation = 0;
    let spinSpeed = 0.3;
    const slowDownFactor = 0.98;
    let spinning = true;

    // Calculate target rotation to stop at winning number
    // The wheel spins clockwise, so we need to calculate the position where the pointer will point to the winning number
    const segmentAngle = (2 * Math.PI) / 10;
    // We add extra rotations (5 full rotations) to make the animation longer
    targetRotation = 2 * Math.PI * 5 + (10 - winningNumber + 0.5) * segmentAngle;

    const animate = () => {
      if (spinning) {
        currentRotation += spinSpeed;
        spinSpeed *= slowDownFactor;

        // Stop spinning when we reach the target rotation
        if (currentRotation >= targetRotation) {
          spinning = false;
          currentRotation = targetRotation;
        }

        drawWheel(currentRotation);
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      spinning = false;
    };
  }, [winningNumber]);

  return <canvas ref={canvasRef} width={300} height={300} className="mx-auto" />;
}
