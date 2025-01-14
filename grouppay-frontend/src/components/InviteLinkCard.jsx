import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiCopy, FiShare2 } from 'react-icons/fi';

const InviteLinkCard = ({ inviteCode, phone }) => {
  const inviteLink = `${window.location.origin}/join/${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    // You could add a toast notification here
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Split Bill',
          text: `Join our split bill group with code: ${inviteCode}`,
          url: inviteLink
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
      <div className="flex justify-center">
        <QRCodeSVG 
          value={inviteLink}
          size={150}
          level="H"
          includeMargin
          className="p-2 bg-white rounded-lg"
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Invite Link:</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
          />
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FiCopy className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FiShare2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Invite Code: <span className="font-mono font-medium">{inviteCode}</span></p>
      </div>
    </div>
  );
};

export default InviteLinkCard; 