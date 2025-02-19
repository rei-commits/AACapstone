import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme();

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-dark-card/50 transition-colors"
    >
      {darkMode ? (
        <FiSun className="w-5 h-5 text-gray-400" />
      ) : (
        <FiMoon className="w-5 h-5 text-gray-400" />
      )}
    </motion.button>
  );
} 