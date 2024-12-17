import React from 'react';

const ChatMessages = ({ messages, loading }) => {
  return (
    <div id="chatMessages" className="flex-1 overflow-y-auto p-6 space-y-4">
      {loading && (
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-indigo-400"></i>
          <p className="text-gray-500">Processing receipt...</p>
        </div>
      )}
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.sent ? 'sent' : 'received'} mb-4`}
        >
          <div className={`flex items-end ${message.sent ? 'justify-end' : ''}`}>
            <div className={`${message.sent ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'} rounded-2xl px-4 py-2 max-w-[80%]`}>
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages; 