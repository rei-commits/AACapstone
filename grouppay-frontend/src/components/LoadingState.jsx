import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2].map((item) => (
        <div key={item} className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
              />
              <div className="space-y-2">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"
                />
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"
                />
              </div>
            </div>
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState; 