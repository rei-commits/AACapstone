import React from 'react';
import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

const SwipeableHistoryItem = ({ transaction, onSelect }) => {
  const renderPaymentStatus = (participant) => {
    const statusColor = participant.hasPaid ? 'bg-green-500' : 'bg-gray-300';
    return (
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span className={`text-sm ${participant.hasPaid ? 'text-green-500' : 'text-gray-500'}`}>
          {participant.hasPaid ? 'Paid' : 'Pending'}
        </span>
      </div>
    );
  };

  const handleReminder = (participant) => {
    // Here you would implement the reminder functionality
    // For example, sending a notification or message
    console.log(`Sending reminder to ${participant.name}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect(transaction)}
      className="p-4 rounded-xl bg-white dark:bg-gray-800 
               shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30
               hover:shadow-xl dark:hover:bg-gray-800/90 
               transition-all duration-200
               cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100/80 dark:bg-gray-700/50 
                      flex items-center justify-center text-2xl shadow-inner">
            {transaction.icon}
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-100">{transaction.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800 dark:text-gray-100">${transaction.amount} USD</p>
          <p className={transaction.status.includes('100%') 
              ? 'text-green-500 dark:text-green-400' 
              : 'text-amber-500 dark:text-amber-400'}>
            {transaction.status}
          </p>
        </div>
      </div>

      {/* Participants Payment Status */}
      <div className="mt-3 space-y-2">
        {transaction.participants.map((participant) => (
          <div key={participant.initials} 
               className="flex items-center justify-between py-1 px-2 rounded-lg
                        bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-${participant.color}-50 dark:bg-${participant.color}-900/20 
                            flex items-center justify-center text-sm font-medium 
                            text-${participant.color}-600 dark:text-${participant.color}-400
                            ring-1 ring-${participant.color}-200 dark:ring-${participant.color}-800/30`}>
                {participant.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{participant.name}</p>
                {renderPaymentStatus(participant)}
              </div>
            </div>
            {!participant.hasPaid && !participant.isCurrentUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReminder(participant);
                }}
                className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 
                         rounded-lg transition-colors"
                title="Send payment reminder"
              >
                <FiBell className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SwipeableHistoryItem; 