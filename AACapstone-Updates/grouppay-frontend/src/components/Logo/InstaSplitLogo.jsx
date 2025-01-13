import React from 'react';
import { motion } from 'framer-motion';

const InstaSplitLogo = ({ className = "w-8 h-8" }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500" />
      </motion.div>
      
      <motion.div 
        className="absolute inset-1 bg-white dark:bg-gray-900 rounded-full"
        initial={false}
        animate={{
          backgroundColor: ['#ffffff', '#111827'],
        }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="w-4/6 h-4/6 text-purple-600 dark:text-purple-400"
          initial={false}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path
            fill="currentColor"
            d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M16.9,7.1C16.5,6.7 15.8,6.7 15.4,7.1L12,10.5L8.6,7.1C8.2,6.7 7.5,6.7 7.1,7.1C6.7,7.5 6.7,8.2 7.1,8.6L10.5,12L7.1,15.4C6.7,15.8 6.7,16.5 7.1,16.9C7.5,17.3 8.2,17.3 8.6,16.9L12,13.5L15.4,16.9C15.8,17.3 16.5,17.3 16.9,16.9C17.3,16.5 17.3,15.8 16.9,15.4L13.5,12L16.9,8.6C17.3,8.2 17.3,7.5 16.9,7.1Z"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

export default InstaSplitLogo; 