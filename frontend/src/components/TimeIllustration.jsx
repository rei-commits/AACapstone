import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function TimeIllustration({ timeOfDay }) {
  const { darkMode } = useTheme();

  const illustrations = {
    morning: (
      <motion.svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        fill="none" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <motion.circle 
          cx="60" 
          cy="60" 
          r="40" 
          fill="#FDB813"
          animate={{ y: [-4, 4, -4] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    ),
    afternoon: (
      <motion.svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        fill="none" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <motion.circle 
          cx="60" 
          cy="60" 
          r="40" 
          fill="#FF9800"
          animate={{ y: [-4, 4, -4] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    ),
    evening: (
      <motion.svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        fill="none" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <motion.g
          animate={{ y: [-4, 4, -4] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <circle 
            cx="60" 
            cy="60" 
            r="40" 
            fill={darkMode ? "#8B5CF6" : "#6366F1"} 
          />
        </motion.g>
      </motion.svg>
    )
  };

  return (
    <div className="relative z-10">
      {illustrations[timeOfDay]}
    </div>
  );
} 