import { useState, useCallback, useRef } from 'react';
import { Particle } from './types';

let particleId = 0;

export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const spawnParticles = useCallback((x: number, y: number, count: number, colors: string[], emojis?: string[]) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 6;
      newParticles.push({
        id: particleId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 6 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 40 + Math.random() * 30,
        emoji: emojis ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Auto-cleanup after animation
    const cleanup = () => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15,
            vx: p.vx * 0.98,
            life: p.life - 1 / p.maxLife,
            size: p.size * 0.97,
          }))
          .filter(p => p.life > 0);
        if (updated.length > 0) {
          animFrameRef.current = requestAnimationFrame(cleanup);
        }
        return updated;
      });
    };

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(cleanup);
  }, []);

  const clearParticles = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    setParticles([]);
  }, []);

  return { particles, spawnParticles, clearParticles };
}
