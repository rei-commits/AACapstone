import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ActionButtons from './ActionButtons';
import BillCalculator from './BillCalculator/BillCalculator';
import CameraModal from './Camera/CameraModal';
import ReceiptProcessor from './Receipt/ReceiptProcessor';

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBillCalculator, setShowBillCalculator] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [processingReceipt, setProcessingReceipt] = useState(false);
  const [receiptImage, setReceiptImage] = useState(null);

  const handleSendMessage = (content) => {
    setMessages([...messages, { content, sent: true }]);
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleSnap = () => {
    setShowCamera(true);
  };

  const handleCapture = (imageBlob) => {
    setReceiptImage(imageBlob);
    setProcessingReceipt(true);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setReceiptImage(file);
        setProcessingReceipt(true);
      }
    };
    input.click();
  };

  const handlePay = () => {
    setShowBillCalculator(true);
  };

  const handleEnd = () => {
    // Implement end chat functionality
  };

  const handleReceiptProcessed = (items) => {
    setProcessingReceipt(false);
    const total = items.reduce((sum, item) => sum + item.price, 0);
    setSubtotal(total);
    
    // Add receipt items as a message
    setMessages(prev => [...prev, {
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 mb-3">Scanned Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ),
      received: true
    }]);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex gap-6">
          <Sidebar />
          
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg h-[80vh] flex flex-col border border-white/50">
              <ChatHeader />
              <ChatMessages messages={messages} loading={loading} />
              <div className="p-6 border-t border-gray-100">
                <ChatInput onSendMessage={handleSendMessage} />
                <ActionButtons 
                  onShare={handleShare}
                  onSnap={handleSnap}
                  onUpload={handleUpload}
                  onPay={handlePay}
                  onEnd={handleEnd}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BillCalculator 
        isOpen={showBillCalculator}
        onClose={() => setShowBillCalculator(false)}
        subtotal={subtotal}
      />

      <CameraModal 
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCapture}
      />

      {processingReceipt && receiptImage && (
        <ReceiptProcessor 
          image={receiptImage}
          onProcessed={handleReceiptProcessed}
          onError={(error) => {
            setProcessingReceipt(false);
            alert(error);
          }}
        />
      )}
    </div>
  );
};

export default GroupChat; 