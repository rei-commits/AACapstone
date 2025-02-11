import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiUser, FiUsers, FiSend, FiCheck } from 'react-icons/fi';

/**
 * Participants Component
 * 
 * Handles the second step of bill creation:
 * - Adding friends from existing contacts
 * - Adding non-member participants
 * - Managing participant list
 * - Sending invites to non-members
 */
const Participants = ({
  billDetails,
  setBillDetails,
  participants,
  handleAddParticipant,
  handleRemoveParticipant,
  handleFriendSelect,
  formatPhoneNumber,
  errors
}) => {
  const [showFriendsList, setShowFriendsList] = useState(false);

  // Mock friends data - replace with actual friends data
  const friends = [
    { id: 1, name: 'Jonel Rodriguez', phone: '(555) 123-4567', avatar: 'JR', isMember: true },
    { id: 2, name: 'Charly Acevedo', phone: '(555) 234-5678', avatar: 'CA', isMember: true },
    { id: 3, name: 'Tiana Martinez', phone: '(555) 345-6789', avatar: 'TM', isMember: true }
  ];

  return (
    <div className="space-y-6">
      {/* Add Participant Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowFriendsList(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400"
        >
          <FiUsers className="w-5 h-5" />
          <span>Add Friends</span>
        </button>
        <button
          onClick={handleAddParticipant}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
        >
          <FiUser className="w-5 h-5" />
          <span>Add Non-Member</span>
        </button>
      </div>

      {/* Friends List Modal */}
      <AnimatePresence>
        {showFriendsList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-medium">Select Friends</h3>
                <button
                  onClick={() => setShowFriendsList(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {friends.map((friend) => {
                  const isSelected = billDetails.participants.some(p => p.phone === friend.phone);
                  return (
                    <button
                      key={friend.id}
                      onClick={() => {
                        handleFriendSelect(friend);
                        setShowFriendsList(false);
                      }}
                      disabled={isSelected}
                      className={`w-full flex items-center gap-4 p-3 rounded-lg ${
                        isSelected
                          ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/20 dark:text-indigo-400">
                        {friend.avatar}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {friend.phone}
                        </div>
                      </div>
                      {isSelected && (
                        <FiCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Participants</h3>
        {errors.participants && (
          <p className="text-sm text-red-600">{errors.participants}</p>
        )}
        <div className="space-y-3">
          {billDetails.participants.map((participant) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/20 dark:text-indigo-400">
                {participant.isCurrentUser ? 'You' : participant.avatar || participant.name?.[0]}
              </div>
              <div className="flex-1">
                {participant.isCurrentUser ? (
                  <div className="font-medium">You</div>
                ) : participant.isMember ? (
                  <div className="font-medium">{participant.name}</div>
                ) : (
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => {
                      const newParticipants = billDetails.participants.map(p =>
                        p.id === participant.id ? { ...p, name: e.target.value } : p
                      );
                      setBillDetails(prev => ({ ...prev, participants: newParticipants }));
                    }}
                    placeholder="Enter name"
                    className="w-full bg-transparent border-none focus:ring-0"
                  />
                )}
                {!participant.isCurrentUser && !participant.isMember && (
                  <input
                    type="text"
                    value={participant.phone}
                    onChange={(e) => {
                      const formattedPhone = formatPhoneNumber(e.target.value);
                      const newParticipants = billDetails.participants.map(p =>
                        p.id === participant.id ? { ...p, phone: formattedPhone } : p
                      );
                      setBillDetails(prev => ({ ...prev, participants: newParticipants }));
                    }}
                    placeholder="Enter phone number"
                    className="w-full text-sm text-gray-500 bg-transparent border-none focus:ring-0 dark:text-gray-400"
                  />
                )}
              </div>
              {!participant.isCurrentUser && (
                <button
                  onClick={() => handleRemoveParticipant(participant.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Participants; 