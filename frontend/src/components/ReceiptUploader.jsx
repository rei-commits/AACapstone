import { useState, useCallback } from 'react';
import { FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function ReceiptUploader({ onUpload, onContinue, hasUploadedFile, scanResult }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (!file) return;

    // Log file details
    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG or PNG file');
      return;
    }

    onUpload(file);
  }, [onUpload]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-300 ${
          isDragging 
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
            : 'border-gray-300 dark:border-gray-700'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('receipt-upload').click()}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full text-white">
            <FiUpload size={24} />
          </div>
          <div>
            <p className="text-lg font-medium mb-1">Drop your receipt here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse from your device
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supports: JPG, PNG
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleDrop}
            id="receipt-upload"
          />
          <label
            htmlFor="receipt-upload"
            className="cursor-pointer py-2 px-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
          >
            Browse Files
          </label>
        </div>
      </div>

      {scanResult && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Scanned Receipt</h3>
            
            {/* Items */}
            <div className="space-y-2 mb-6">
              {scanResult.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${scanResult.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>${scanResult.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${scanResult.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue to Add Friends
          </motion.button>
        </div>
      )}
    </div>
  );
} 