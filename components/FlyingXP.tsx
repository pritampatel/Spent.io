
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const m = motion as any;

interface Props {
  trigger: boolean;
  onComplete: () => void;
  sourceX?: number;
  sourceY?: number;
}

const FlyingXP: React.FC<Props> = ({ trigger, onComplete, sourceX, sourceY }) => {
  const [particles, setParticles] = useState<{ id: number; delay: number; x: number; y: number; scale: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      const startX = sourceX ?? window.innerWidth / 2;
      const startY = sourceY ?? window.innerHeight / 2;
      
      const newParticles = Array.from({ length: 10 }, (_, i) => ({
        id: Math.random(),
        delay: i * 0.08,
        x: startX + (Math.random() - 0.5) * 60,
        y: startY + (Math.random() - 0.5) * 60,
        scale: 0.5 + Math.random() * 1,
      }));
      
      setParticles(newParticles);
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, sourceX, sourceY, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[300]">
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
                p.x + (Math.random() - 0.5) * 150, // Initial burst out
                40 // Target horizontal (Level badge)
              ],
              y: [
                p.y,
                p.y - 100, // Arc upwards
                60 // Target vertical (Level badge)
              ],
              scale: [0, 1.5, 0.4],
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 1.4, 
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for a snappy yet smooth feel
            }}
            className="absolute"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-md opacity-50 rounded-full scale-150" />
              <Star className="text-amber-400 fill-current" size={16 * p.scale} />
            </div>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyingXP;
