
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1, 
        filter: 'blur(10px)',
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Background blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-500 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-500 rounded-full blur-[100px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] mb-8"
        >
          <Wallet size={40} className="text-slate-900" strokeWidth={2.5} />
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "circOut" }}
            className="text-4xl font-black text-white tracking-tighter"
          >
            Spent.io
          </motion.h1>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          className="text-[10px] font-black text-white uppercase tracking-[0.4em] mt-4"
        >
          Intelligent Finance
        </motion.p>
      </div>

      <div className="absolute bottom-20 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full bg-indigo-400"
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
