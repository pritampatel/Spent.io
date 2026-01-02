
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

const m = motion as any;

interface Props {
  trigger: boolean;
  onComplete: () => void;
  sourceX?: number;
  sourceY?: number;
}

const FlyingXP: React.FC<Props> = ({ trigger, onComplete, sourceX, sourceY }) => {
  const [particles, setParticles] = useState<{ id: number; delay: number; x: number; y: number; scale: number; type: 'star' | 'sparkle' }[]>([]);

  useEffect(() => {
    if (trigger) {
      const startX = sourceX ?? window.innerWidth / 2;
      const startY = sourceY ?? window.innerHeight / 2;
      
      // Increased count for "prominence"
      const newParticles = Array.from({ length: 18 }, (_, i) => ({
        id: Math.random(),
        delay: i * 0.05,
        x: startX + (Math.random() - 0.5) * 80,
        y: startY + (Math.random() - 0.5) * 80,
        scale: 0.6 + Math.random() * 1.2,
        type: Math.random() > 0.3 ? 'star' : 'sparkle' as const
      }));
      
      setParticles(newParticles);
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [trigger, sourceX, sourceY, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[500]">
      <AnimatePresence>
        {particles.map((p) => (
          <m.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y,
              scale: 0,
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              x: [
                p.x,
                p.x + (Math.random() - 0.5) * 200, // Initial burst out wider
                40 // Target horizontal (Level badge area)
              ],
              y: [
                p.y,
                p.y - 120, // Higher arc
                60 // Target vertical (Level badge area)
              ],
              scale: [0, 1.8, 0.4],
              opacity: [0, 1, 1, 0],
              rotate: [0, 270, 720]
            }}
            transition={{ 
              duration: 1.6, 
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="absolute"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-lg opacity-60 rounded-full scale-150 animate-pulse" />
              {p.type === 'star' ? (
                <Star className="text-amber-400 fill-amber-400" size={16 * p.scale} />
              ) : (
                <Sparkles className="text-white" size={12 * p.scale} />
              )}
            </div>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyingXP;
