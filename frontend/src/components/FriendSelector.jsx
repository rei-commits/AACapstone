import { useState } from 'react';

export default function FriendSelector({ onSelect, selected }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends] = useState([
    { uid: '1', name: 'Sophia Rodriguez', email: 'sophia@example.com' },
    { uid: '2', name: 'Marcus Chen', email: 'marcus@example.com' },
    { uid: '3', name: 'Isabella Kim', email: 'isabella@example.com' },
    { uid: '4', name: 'Ethan James', email: 'ethan@example.com' }
  ]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleSelect = (friend) => {
    if (selected.find(f => f.uid === friend.uid)) {
      onSelect(selected.filter(f => f.uid !== friend.uid));
    } else {
      onSelect([...selected, friend]);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2A2C4E] text-gray-900 dark:text-white"
      />
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {friends
          .filter(friend => 
            friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(friend => (
            <button
              key={friend.uid}
              onClick={() => handleSelect(friend)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                selected.find(f => f.uid === friend.uid)
                  ? 'bg-purple-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-[#2A2C4E]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {getInitials(friend.name)}
              </div>
              <div className="text-left">
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
} 