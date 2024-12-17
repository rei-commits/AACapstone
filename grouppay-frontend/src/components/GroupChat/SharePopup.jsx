import React from 'react';

const SharePopup = ({ shareCode, onClose }) => {
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Bill Splitting Group',
          text: `Join our bill splitting group with code: ${shareCode}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert('Native sharing not supported on this device/browser');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      alert('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-80 rounded-xl bg-white shadow-xl border border-gray-100 p-4 z-50">
      <div className="mb-4 text-center">
        <p className="text-gray-600 text-sm">
          Give this code to everyone around the table so they can join the bill from their phones, 
          select their own items and settle up within the app
        </p>
      </div>
      
      <div className="space-y-1">
        <button 
          onClick={handleNativeShare}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
        >
          <i className="fas fa-share-alt text-indigo-600"></i>
          <span>Share via Messages</span>
        </button>
        <button 
          onClick={handleCopyCode}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
        >
          <i className="fas fa-copy text-indigo-600"></i>
          <span>Copy Code</span>
        </button>
      </div>
    </div>
  );
};

export default SharePopup; 