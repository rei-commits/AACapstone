import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const ReceiptProcessor = ({ image, onProcessed, onError }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (image) {
      processReceipt(image);
    }
  }, [image]);

  const processReceipt = async (imageData) => {
    try {
      const result = await Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(parseInt(m.progress * 100));
            }
          }
        }
      );

      const items = parseReceiptText(result.data.text);
      onProcessed(items);
    } catch (error) {
      console.error('Error processing receipt:', error);
      onError('Failed to process receipt');
    }
  };

  const parseReceiptText = (text) => {
    const lines = text.split('\n');
    const items = [];
    const priceRegex = /\$?\d+\.\d{2}/;

    lines.forEach(line => {
      if (line.trim() && 
          !line.toLowerCase().includes('total') && 
          !line.toLowerCase().includes('tax') && 
          !line.toLowerCase().includes('subtotal')) {
        
        const priceMatch = line.match(priceRegex);
        if (priceMatch) {
          const price = priceMatch[0].replace('$', '');
          let name = line
            .replace(priceMatch[0], '')
            .replace(/^[\d.]+\s*/, '')
            .trim();
          
          if (name && name.match(/[a-zA-Z]/)) {
            items.push({
              name: name,
              price: parseFloat(price)
            });
          }
        }
      }
    });

    return items;
  };

  return (
    <div className="text-center">
      <i className="fas fa-spinner fa-spin text-3xl text-indigo-600 mb-2"></i>
      <p className="text-gray-600">Processing receipt... {progress}%</p>
    </div>
  );
};

export default ReceiptProcessor; 