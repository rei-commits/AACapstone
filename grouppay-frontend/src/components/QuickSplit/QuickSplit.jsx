import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GroupPayLogo from '../Logo/GroupPayLogo';

/**
 * QuickSplit Component
 * Allows users to quickly split bills between multiple people
 * Features drag and drop, bill scanning, and manual input
 */
const QuickSplit = () => {
  const navigate = useNavigate();
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  const handleContinue = () => {
    setShowRegisterPrompt(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-bg">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-bg">
        <div className="flex items-center gap-3 mb-6">
          <GroupPayLogo className="w-10 h-10" />
          <h2 className="text-2xl font-bold">Quick Split</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Split bills instantly - no account needed
        </p>
        
        {/* Calculator UI here */}
        <div className="space-y-4">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="number"
                placeholder="Enter total amount"
                className="w-full p-4 text-2xl font-bold rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 transition-all duration-300
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
            </div>
            {/* Add more calculator UI here */}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full mt-6 btn-primary"
        >
          Continue
        </button>
      </div>

      {/* Registration Prompt Modal */}
      <AnimatePresence>
        {showRegisterPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRegisterPrompt(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Want to Save Your Progress?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Loving GroupPay? Create a free account to unlock more features:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Save calculation history</li>
                  <li>Create and manage groups</li>
                  <li>Track shared expenses</li>
                  <li>Get detailed insights and spending patterns</li>
                  <li>Sync across all your devices</li>
                </ul>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRegisterPrompt(false);
                    navigate('/signup');
                  }}
                  className="flex-1 btn-primary bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setShowRegisterPrompt(false)}
                  className="flex-1 btn-primary bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Continue as Guest
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickSplit; 