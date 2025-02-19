import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function FriendSelector({ selected, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock friends data with correct ID format
  const myFriends = [
    { id: 2, name: 'Tiana Martinez', email: 'tiana@example.com' },
    { id: 3, name: 'Charly Acevedo', email: 'charly@example.com' },
    { id: 4, name: 'Jonel Rodriguez', email: 'jonel@example.com' }
  ];

  const filteredFriends = myFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFriendSelect = (friend) => {
    console.log('Attempting to select friend:', friend);
    if (!friend || !friend.id) {
      console.error('Invalid friend data:', friend);
      return;
    }
    
    // Check if friend is already selected
    const isAlreadySelected = selected.some(f => f.id === friend.id);
    console.log('Is already selected:', isAlreadySelected);
    if (!isAlreadySelected) {
      onSelect(prev => [...prev, friend]);
      console.log('Added friend to selection:', friend);
    }
  };

  const getInitials = (name) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getGradientColor = (name) => {
    // Generate a consistent color based on name
    const colors = [
      ['from-purple-500 to-blue-500'],
      ['from-pink-500 to-rose-500'],
      ['from-blue-500 to-cyan-500'],
      ['from-emerald-500 to-teal-500'],
      ['from-orange-500 to-amber-500']
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-white"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
        {filteredFriends.map(friend => (
          <div
            key={friend.id}
            onClick={() => handleFriendSelect(friend)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer
              ${selected.find(f => f.id === friend.id)
                ? 'bg-purple-500/20 border border-purple-500/50'
                : 'hover:bg-gray-800/50'
              }`}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getGradientColor(friend.name)}
                         flex items-center justify-center text-white font-medium`}>
              {getInitials(friend.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{friend.name}</p>
              <p className="text-sm text-gray-400 truncate">{friend.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 