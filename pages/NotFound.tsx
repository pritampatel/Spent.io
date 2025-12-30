
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ghost } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] flex flex-col items-center justify-center px-10 text-center"
    >
      <div className="relative mb-12">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 bg-indigo-50 rounded-[3rem] flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100"
        >
          <Ghost size={64} strokeWidth={1.5} />
        </motion.div>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-xs font-black text-slate-400">
          404
        </div>
      </div>

      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Lost in the Void?</h2>
      <p className="text-sm font-bold text-slate-400 leading-relaxed mb-10 max-w-[240px]">
        This page seems to have vanished from your portfolio. Let's get you back.
      </p>

      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.75rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-slate-200"
      >
        <ArrowLeft size={16} />
        Return to Safety
      </motion.button>

      {/* Background visual clutter */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: Math.random() * 400, y: Math.random() * 800 }}
            animate={{ 
              x: Math.random() * 400,
              y: Math.random() * 800
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute text-[80px] font-black text-slate-900 select-none"
          >
            {i % 2 === 0 ? '4' : '0'}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotFound;
