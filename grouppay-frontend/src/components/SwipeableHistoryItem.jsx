import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const SwipeableHistoryItem = ({ item }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      style={{ x, opacity, scale }}
      whileTap={{ cursor: 'grabbing' }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 cursor-grab"
    >
      {/* Existing history item content */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            {item.icon}
          </div>
          <div>
            <h4 className="font-medium">{item.title}</h4>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
                ))}
              </div>
              <span className="text-sm text-green-500">{item.status}</span>
            </div>
          </div>
        </div>
        <p className="font-semibold">{item.amount} USD</p>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>{item.date}</p>
        <button className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          View Detail
        </button>
      </div>
    </motion.div>
  );
};

export default SwipeableHistoryItem; 