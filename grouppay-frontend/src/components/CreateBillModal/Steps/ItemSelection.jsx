import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

/**
 * ItemSelection Component
 * 
 * Handles the third step of bill creation:
 * - Displaying scanned items for selection
 * - Managing item assignments to participants
 * - Showing real-time cost calculations
 * - Displaying individual shares including tax and tip
 */
const ItemSelection = ({
  billDetails,
  participants,
  itemAssignments,
  assignItemToParticipant,
  removeItemAssignment,
  calculateShares,
  errors
}) => {
  // Calculate current shares
  const shares = calculateShares(itemAssignments);

  return (
    <div className="space-y-6">
      {/* Participants Quick View */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {billDetails.participants.map((participant) => (
          <div
            key={participant.id}
            className="flex flex-col items-center"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/20 dark:text-indigo-400">
              {participant.isCurrentUser ? 'You' : participant.avatar || participant.name?.[0]}
            </div>
            <div className="mt-1 text-xs font-medium">
              ${shares[participant.id]?.totalShare.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Your Items</h3>
        {errors.items && (
          <p className="text-sm text-red-600">{errors.items}</p>
        )}
        <div className="space-y-3">
          {billDetails.scannedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right font-medium">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
              
              {/* Participant Selection */}
              <div className="mt-2 flex flex-wrap gap-2">
                {billDetails.participants.map((participant) => {
                  const isSelected = itemAssignments[item.id]?.includes(participant.id);
                  const shareAmount = isSelected
                    ? (item.price * item.quantity) / (itemAssignments[item.id]?.length || 1)
                    : 0;

                  return (
                    <button
                      key={participant.id}
                      onClick={() => {
                        if (isSelected) {
                          removeItemAssignment(item.id, participant.id);
                        } else {
                          assignItemToParticipant(item.id, participant.id);
                        }
                      }}
                      className={`relative group flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {participant.isCurrentUser ? 'You' : participant.avatar || participant.name?.[0]}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                      )}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {isSelected ? `$${shareAmount.toFixed(2)}` : participant.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="pt-4 border-t dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">Bill Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {billDetails.participants.map((participant) => {
            const share = shares[participant.id] || { baseShare: 0, taxShare: 0, tipShare: 0, totalShare: 0 };
            return (
              <div
                key={participant.id}
                className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/20 dark:text-indigo-400">
                    {participant.isCurrentUser ? 'You' : participant.avatar || participant.name?.[0]}
                  </div>
                  <div className="font-medium">
                    {participant.isCurrentUser ? 'Your Share' : `${participant.name}'s Share`}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>${share.baseShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Tax</span>
                    <span>+${share.taxShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Tip ({billDetails.tipPercentage}%)</span>
                    <span>+${share.tipShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-1 border-t dark:border-gray-600">
                    <span>Total</span>
                    <span>${share.totalShare.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ItemSelection; 