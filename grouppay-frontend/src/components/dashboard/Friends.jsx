import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUserPlus, FiSearch } from 'react-icons/fi';

const Friends = () => {
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const friends = [
    { id: 1, name: 'Jonel Rodriguez', avatar: 'JR', color: 'from-blue-500 to-indigo-500' },
    { id: 2, name: 'Charly Acevedo', avatar: 'CA', color: 'from-purple-500 to-pink-500' },
    { id: 3, name: 'Tiana Martinez', avatar: 'TM', color: 'from-rose-500 to-orange-500' },
  ];

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Friends</h3>
          <button 
            onClick={() => setShowAllFriends(true)}
            className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-6">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center min-w-[80px] group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${friend.color} 
                              flex items-center justify-center text-white font-medium text-lg mb-2
                              shadow-lg shadow-${friend.color.split(' ')[1]}/20
                              group-hover:scale-105 transition-transform duration-200`}>
                  {friend.avatar}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 text-center whitespace-nowrap
                               group-hover:text-indigo-500 transition-colors duration-200">
                  {friend.name.split(' ')[0]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Friends Modal */}
      <AnimatePresence>
        {showAllFriends && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowAllFriends(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] max-h-[80vh] overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 max-w-2xl mx-auto"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Friends</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                    <FiUserPlus className="w-5 h-5" />
                    <span>Add Friend</span>
                  </button>
                  <button
                    onClick={() => setShowAllFriends(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search friends..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl"
                  />
                </div>
              </div>

              {/* Friends List */}
              <div className="overflow-y-auto max-h-[calc(80vh-180px)]">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${friend.color} 
                                    flex items-center justify-center text-white font-medium`}>
                        {friend.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{friend.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Friend</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm text-indigo-500 hover:text-indigo-600 font-medium">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Friends; 