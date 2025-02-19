import { useState } from 'react';
import { FiX, FiPlus, FiMail, FiPhone, FiMoreVertical, FiUserPlus, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Modal from './Modal';

export default function FriendsModal({ isOpen, onClose, onFriendSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends] = useState([
    { 
      id: 1, 
      name: 'Tiana Martinez', 
      email: 'tiana.m@example.com',
      phone: '+1 (555) 123-4567',
      owes: 25.50,
      owed: 0,
      lastActivity: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Charly Acevedo', 
      email: 'charly.a@example.com',
      phone: '+1 (555) 234-5678',
      owes: 0,
      owed: 32.75,
      lastActivity: '1 day ago'
    },
    { 
      id: 3, 
      name: 'Jonel Rodriguez', 
      email: 'jonel.r@example.com',
      phone: '+1 (555) 345-6789',
      owes: 15.25,
      owed: 0,
      lastActivity: '3 days ago'
    },
    { 
      id: 4, 
      name: 'Raquel Peralta', 
      email: 'raquel.p@example.com',
      phone: '+1 (555) 456-7890',
      owes: 0,
      owed: 45.00,
      lastActivity: '1 week ago'
    }
  ]);

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFriend = (friend) => {
    if (!friend || !friend.id) {
      console.error("Invalid friend data:", friend);
      return;
    }
    onFriendSelect({
      id: friend.id,
      name: friend.name
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[600px] bg-[#1A1C2E] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Friends
            </h2>
            <button onClick={onClose}>
              <FiX className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>

          {/* Search and Add Friend */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2A2C4E] rounded-lg border border-gray-700 
                  focus:border-purple-500 focus:outline-none text-gray-300"
              />
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg 
              text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
              <FiUserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </button>
          </div>
        </div>

        {/* Friends List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredFriends.map(friend => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-[#2A2C4E] hover:bg-[#2F3153] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 p-[2px]">
                        <div className="w-full h-full rounded-[10px] bg-[#2A2C4E] flex items-center justify-center">
                          <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-500 
                            bg-clip-text text-transparent">
                            {friend.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2A2C4E]" />
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {friend.name}
                        <span className="text-xs text-gray-500">• {friend.lastActivity}</span>
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center text-gray-400 text-sm">
                          <FiMail className="w-3 h-3 mr-1" />
                          <span>{friend.email}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <FiPhone className="w-3 h-3 mr-1" />
                          <span>{friend.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Balance */}
                    <div className="text-right">
                      {friend.owes > 0 && (
                        <p className="text-red-400 font-medium">Owes you ${friend.owes.toFixed(2)}</p>
                      )}
                      {friend.owed > 0 && (
                        <p className="text-green-400 font-medium">You owe ${friend.owed.toFixed(2)}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" onClick={() => handleSelectFriend(friend)}>
                        <FiMoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
} 