import React from 'react';

const ActionButton = ({ icon, label, onClick, danger }) => (
  <button 
    onClick={onClick}
    className={`btn-action ${danger ? 'danger' : ''}`}
  >
    <i className={`fas fa-${icon}`}></i>
    <span>{label}</span>
  </button>
);

const ActionButtons = ({ 
  onShare, 
  onSnap, 
  onUpload, 
  onPay, 
  onEnd 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton icon="link" label="Share" onClick={onShare} />
      <ActionButton icon="camera" label="Snap" onClick={onSnap} />
      <ActionButton icon="upload" label="Upload" onClick={onUpload} />
      <ActionButton icon="credit-card" label="Pay" onClick={onPay} />
      <ActionButton icon="times" label="End" onClick={onEnd} danger />
    </div>
  );
};

export default ActionButtons; 