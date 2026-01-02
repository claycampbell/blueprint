import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isActive) return null;

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'][i % 5],
    delay: Math.random() * 0.3,
    xOffset: (Math.random() - 0.5) * 200,
    rotation: Math.random() * 360
  }));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 9998,
      overflow: 'hidden'
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '20%',
            width: '10px',
            height: '10px',
            backgroundColor: particle.color,
            borderRadius: '2px',
            animation: `confettiFall 2s ease-out ${particle.delay}s`,
            transform: `translateX(${particle.xOffset}px) rotate(${particle.rotation}deg)`,
            opacity: 0
          }}
        />
      ))}

      <style>{`
        @keyframes confettiFall {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(var(--x-offset, 0)) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(600px) translateX(var(--x-offset, 0)) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};
