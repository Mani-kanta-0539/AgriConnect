import { motion } from 'motion/react';

export function SkeletonLoader({ type = 'card' }: { type?: 'card' | 'list' | 'chart' }) {
  if (type === 'card') {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-[24px] border border-white/20 p-6 shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-12 h-12 rounded-full bg-stone-200/50 shadow-inner"
          />
          <div className="space-y-2 flex-1">
            <motion.div 
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-4 bg-stone-200/50 rounded-full w-1/3"
            />
            <motion.div 
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="h-3 bg-stone-200/50 rounded-full w-1/4"
            />
          </div>
        </div>
        <div className="space-y-3">
          <motion.div 
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
            className="h-3 bg-stone-200/50 rounded-full w-full"
          />
          <motion.div 
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            className="h-3 bg-stone-200/50 rounded-full w-5/6"
          />
          <motion.div 
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            className="h-3 bg-stone-200/50 rounded-full w-4/6"
          />
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-[24px] border border-white/20 p-6 shadow-sm overflow-hidden relative h-64 flex items-end justify-between gap-2">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: [`${h}%`, `${h + 10}%`, `${h}%`], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
            className="w-full bg-stone-200/50 rounded-t-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/40 backdrop-blur-md rounded-[16px] border border-white/20 p-4 shadow-sm overflow-hidden relative flex items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
            className="w-10 h-10 rounded-xl bg-stone-200/50"
          />
          <div className="space-y-2 flex-1">
            <motion.div 
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
              className="h-3 bg-stone-200/50 rounded-full w-1/2"
            />
            <motion.div 
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              className="h-2 bg-stone-200/50 rounded-full w-1/3"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
