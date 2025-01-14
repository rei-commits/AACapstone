import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiUpload, FiX, FiEdit2 } from 'react-icons/fi';

/**
 * ReceiptUpload Component
 * 
 * Handles the first step of bill creation:
 * - Receipt upload via file or camera
 * - Bill title and emoji selection
 * - Scanned items display and editing
 * - Tip percentage selection
 */
const ReceiptUpload = ({
  billDetails,
  setBillDetails,
  showScanner,
  setShowScanner,
  addScannedItem,
  removeScannedItem,
  updateScannedItem,
  handleTipChange,
  handleCustomTipChange,
  errors
}) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  /**
   * Handles file upload for receipt
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you would typically send the file to your OCR service
      // For now, we'll simulate some scanned items
      const mockItems = [
        { id: 1, name: 'Burger', quantity: 1, price: 12.99 },
        { id: 2, name: 'Fries', quantity: 1, price: 4.99 },
        { id: 3, name: 'Drink', quantity: 1, price: 2.99 }
      ];
      mockItems.forEach(addScannedItem);
      setBillDetails(prev => ({ ...prev, tax: 2.02 }));
    }
  };

  /**
   * Starts the camera for receipt scanning
   */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowScanner(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  /**
   * Stops the camera
   */
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowScanner(false);
  };

  /**
   * Captures a photo from the camera
   */
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Here you would typically send the canvas data to your OCR service
      // For now, we'll simulate some scanned items
      const mockItems = [
        { id: 1, name: 'Pizza', quantity: 1, price: 15.99 },
        { id: 2, name: 'Salad', quantity: 1, price: 8.99 },
        { id: 3, name: 'Soda', quantity: 2, price: 2.50 }
      ];
      mockItems.forEach(addScannedItem);
      setBillDetails(prev => ({ ...prev, tax: 2.02 }));
      stopCamera();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Bill Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={billDetails.title}
            onChange={(e) => setBillDetails(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter a title for your bill"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
      </div>

      {/* Receipt Upload/Scan */}
      {!billDetails.scannedItems.length && !showScanner && (
        <div className="flex gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 dark:border-gray-600 dark:hover:border-indigo-400"
          >
            <FiUpload className="w-5 h-5" />
            <span>Upload Receipt</span>
          </button>
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 dark:border-gray-600 dark:hover:border-indigo-400"
          >
            <FiCamera className="w-5 h-5" />
            <span>Scan Receipt</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {showScanner && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capturePhoto}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Scanned Items */}
      {billDetails.scannedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Scanned Items</h3>
          <div className="space-y-2">
            {billDetails.scannedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateScannedItem(item.id, { name: e.target.value })}
                      className="font-medium bg-transparent border-none focus:ring-0"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateScannedItem(item.id, { quantity: Number(e.target.value) })}
                        min="1"
                        className="w-16 bg-transparent border-none focus:ring-0"
                      />
                      x
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateScannedItem(item.id, { price: Number(e.target.value) })}
                        step="0.01"
                        min="0"
                        className="w-20 bg-transparent border-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeScannedItem(item.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Tip Selection */}
          <div className="pt-4 border-t dark:border-gray-600">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tip Percentage
            </label>
            <div className="mt-2 flex gap-2">
              {[15, 18, 20].map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => handleTipChange(percentage)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    billDetails.tipPercentage === percentage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {percentage}%
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  value={billDetails.customTipPercentage}
                  onChange={(e) => handleCustomTipChange(e.target.value)}
                  placeholder="Custom"
                  min="0"
                  max="100"
                  className="w-20 px-3 py-2 text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="pt-4 border-t dark:border-gray-600">
            <h3 className="text-lg font-medium mb-2">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${billDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${billDetails.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip ({billDetails.tipPercentage}%)</span>
                <span>${((billDetails.subtotal * billDetails.tipPercentage) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2 border-t dark:border-gray-600">
                <span>Total</span>
                <span>${billDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload; 