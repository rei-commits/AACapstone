import React, { useState } from 'react';
import { FiMoreVertical, FiUpload, FiCamera, FiShare2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const GroupChat = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John',
      text: 'Added a new expense: Dinner - $50',
      time: '11:21:58 AM'
    },
    {
      id: 2,
      sender: 'Sarah',
      text: 'Split equally between all members',
      time: '11:51:58 AM'
    }
  ]);

  const handleMenuClick = (action) => {
    switch(action) {
      case 'share':
        // Handle share group link
        break;
      case 'upload':
      case 'snap':
        navigate('/quick-split');
        break;
      case 'end':
        navigate('/dashboard');
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-xl font-semibold">🍕 pizza party</h1>
          
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <button
                  onClick={() => handleMenuClick('share')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiShare2 className="w-5 h-5" />
                  Share Group Link
                </button>
                <button
                  onClick={() => handleMenuClick('upload')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiUpload className="w-5 h-5" />
                  Upload Receipt
                </button>
                <button
                  onClick={() => handleMenuClick('snap')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiCamera className="w-5 h-5" />
                  Snap Receipt
                </button>
                <button
                  onClick={() => handleMenuClick('end')}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiX className="w-5 h-5" />
                  End Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto p-4 mb-20">
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className="text-center">
              <div className="text-sm text-gray-500">
                {message.sender}: {message.text}
              </div>
              <div className="text-xs text-gray-400">
                {message.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat; 