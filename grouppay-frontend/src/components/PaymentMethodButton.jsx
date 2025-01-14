import React from 'react';
import { motion } from 'framer-motion';

const PaymentMethodButton = ({ method, isSelected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(method)}
      className={`w-full flex items-center gap-3 p-3 border rounded-xl transition-all
                ${isSelected ? 
                  'border-green-500 bg-green-50 dark:bg-green-900/20' : 
                  'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
    >
      <span className="text-xl">{method.icon}</span>
      <span className={isSelected ? 'text-green-600 font-medium' : ''}>{method.name}</span>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

export default PaymentMethodButton; 