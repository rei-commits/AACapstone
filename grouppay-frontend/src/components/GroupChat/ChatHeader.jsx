import React, { useState } from 'react';
import SharePopup from './SharePopup';

const ChatHeader = () => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const shareCode = 'QIA9QX';

  return (
    <div className="p-6 border-b border-gray-100">
      <div className="text-center relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Chat</h2>
        <button 
          onClick={() => setShowSharePopup(!showSharePopup)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          <i className="fas fa-link text-indigo-600"></i>
          <span className="text-gray-700">
            Share code: <span className="font-bold text-indigo-600">{shareCode}</span>
          </span>
        </button>

        {showSharePopup && (
          <SharePopup 
            shareCode={shareCode} 
            onClose={() => setShowSharePopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatHeader; 