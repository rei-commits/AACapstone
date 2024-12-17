import React, { useState } from 'react';
import EmojiPicker from './EmojiPicker';

const CreateGroupForm = ({ onSubmit }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: groupName,
      emoji: selectedEmoji
    });
  };

  return (
    <div className="w-full max-w-md mx-4">
      <h1 className="text-white text-3xl font-semibold text-center mb-6">
        GroupPay: Create a Group
      </h1>
      
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2 font-medium">
              Group Name
            </label>
            <input 
              type="text" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2 font-medium">
              Group Avatar
            </label>
            <button 
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>Select Emoji</span>
              <span className="text-xl">{selectedEmoji}</span>
            </button>
            {showEmojiPicker && (
              <EmojiPicker 
                onSelect={(emoji) => {
                  setSelectedEmoji(emoji);
                  setShowEmojiPicker(false);
                }}
              />
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Group
          </button>

          <button 
            type="button"
            onClick={() => window.location.href = '/'}
            className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm; 