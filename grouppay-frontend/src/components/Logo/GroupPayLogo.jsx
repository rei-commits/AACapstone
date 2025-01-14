import React from 'react';
import { motion } from 'framer-motion';

/**
 * GroupPay Logo Component
 * Animated logo with optional size variants
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {boolean} props.animated - Whether to animate the logo
 */
const GroupPayLogo = ({ size = 'md', animated = true }) => {
  return (
    <motion.div
      className={`relative ${size}`}
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
        <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500" />
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
          className="w-4/6 h-4/6 text-indigo-600 dark:text-indigo-400"
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
            d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

export default GroupPayLogo; 