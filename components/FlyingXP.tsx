
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface Props {
  trigger: boolean;
  onComplete: () => void;
}

const FlyingXP: React.FC<Props> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (trigger) {
      setParticles(Array.from({ length: 12 }, (_, i) => i));
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[300]">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p}
            initial={{ 
              x: window.innerWidth / 2, 
              y: window.innerHeight / 2,
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: [
                window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                30 // Target approximate XP bar position
              ],
              y: [
                window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                50 // Target approximate XP bar position
              ],
              scale: [1.5, 0.5],
              opacity: [1, 1, 0]
            }}
            transition={{ 
              duration: 1.2, 
              delay: p * 0.03,
              ease: "circIn"
            }}
            className="absolute"
          >
            <Star className="text-amber-400 fill-current shadow-lg" size={20} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyingXP;
