import React from 'react';
import { Particle } from '../types';

interface Props {
  particles: Particle[];
}

const ParticleLayer: React.FC<Props> = ({ particles }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            opacity: p.life,
            transform: `rotate(${p.id * 45}deg) scale(${p.life})`,
            transition: 'none',
            willChange: 'transform, opacity',
          }}
        >
          {p.emoji ? (
            <span style={{ fontSize: p.size }}>{p.emoji}</span>
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: p.color }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(ParticleLayer);
