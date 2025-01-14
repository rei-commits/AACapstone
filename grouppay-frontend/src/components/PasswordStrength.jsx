import React from 'react';
import { motion } from 'framer-motion';

/**
 * Password Strength Indicator Component
 * Visual indicator for password strength
 * Shows different colors and messages based on password complexity
 * 
 * @param {Object} props
 * @param {string} props.password - The password to evaluate
 */
const PasswordStrength = ({ password }) => {
  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`flex-1 rounded-full ${
              i < strength ? strengthColors[strength - 1] : 'bg-gray-200 dark:bg-gray-700'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i < strength ? 1 : 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
        ))}
      </div>
      {password && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm mt-1 ${
            strength === 0 ? 'text-red-500' :
            strength === 1 ? 'text-yellow-500' :
            strength === 2 ? 'text-blue-500' :
            'text-green-500'
          }`}
        >
          {strengthText[strength - 1]}
        </motion.p>
      )}
    </div>
  );
};

export default PasswordStrength; 