import React, { useRef, useState } from 'react';
import { FiUpload, FiCamera } from 'react-icons/fi';
import { createWorker } from 'tesseract.js';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ReceiptUploader({ onScanComplete }) {
    const { darkMode } = useTheme();
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const cleanItemName = (name) => {
        // Remove trailing 'S' and any extra whitespace
        return name.replace(/\s+S$/i, '').trim();
    };

    const handleFile = async (file) => {
        if (isScanning) return; // Prevent multiple scans
        
        if (file) {
            setIsLoading(true);
            try {
                setIsScanning(true);
                // Show preview
                const preview = URL.createObjectURL(file);
                setPreviewUrl(preview);

                // Process the image
                let worker = null;
                try {
                    worker = await createWorker();
                    const reader = new FileReader();
                    
                    reader.onload = async () => {
                        try {
                            const { data: { text } } = await worker.recognize(reader.result);
                            console.log('Raw OCR text:', text);

                            // Parse the text into structured data
                            const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
                            const items = [];
                            let tax = 0;
                            let total = 0;

                            // Track seen items to prevent duplicates
                            const seenItems = new Set();

                            for (const line of lines) {
                                const priceMatch = line.match(/[\$]?\s*(\d+\.\d{2})/);
                                if (priceMatch) {
                                    const price = parseFloat(priceMatch[1]);
                                    let name = line.replace(priceMatch[0], '').trim();

                                    // Check if it's a tax or total line
                                    if (line.toLowerCase().includes('tax')) {
                                        tax = price;
                                        continue;
                                    }
                                    if (line.toLowerCase().includes('total')) {
                                        total = price;
                                        continue;
                                    }

                                    // Look for quantity at start of line
                                    const qtyMatch = name.match(/^(\d+)\s+/);
                                    let quantity = 1;
                                    if (qtyMatch) {
                                        quantity = parseInt(qtyMatch[1]);
                                        name = name.replace(qtyMatch[0], '').trim();
                                    }

                                    // Clean up item name
                                    name = cleanItemName(name);
                                    
                                    // Create unique key for item
                                    const itemKey = `${name}-${price}`;

                                    // Only add if we haven't seen this exact item before
                                    if (name && price > 0 && !seenItems.has(itemKey)) {
                                        seenItems.add(itemKey);
                                        items.push({
                                            id: `item-${items.length + 1}`,
                                            name: name.toUpperCase(),
                                            price: price,
                                            quantity
                                        });
                                    }
                                }
                            }

                            const result = {
                                items,
                                tax,
                                total,
                                subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                            };

                            console.log('Processed receipt:', result);
                            onScanComplete(result);
                            setIsLoading(false);
                        } catch (error) {
                            console.error('Error processing text:', error);
                            setIsLoading(false);
                        } finally {
                            if (worker) {
                                await worker.terminate();
                            }
                        }
                    };

                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error('Error initializing worker:', error);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error processing receipt:', error);
                setIsLoading(false);
            } finally {
                setIsScanning(false);
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Preview Area */}
            {previewUrl && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <img 
                        src={previewUrl} 
                        alt="Receipt preview" 
                        className="w-full h-full object-contain"
                    />
                    <button
                        onClick={() => {
                            setPreviewUrl(null);
                            fileInputRef.current.value = '';
                            if (cameraInputRef.current) cameraInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Upload/Camera Buttons */}
            <div className="flex gap-4">
                {/* Upload Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                >
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className={`w-full p-4 rounded-xl border-2 border-dashed ${
                            darkMode 
                                ? 'border-gray-700 hover:border-gray-600' 
                                : 'border-gray-300 hover:border-gray-400'
                        } flex flex-col items-center justify-center gap-2 transition-colors`}
                        disabled={isLoading}
                    >
                        <FiUpload className="w-6 h-6 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isLoading ? 'Processing...' : 'Upload Receipt'}
                        </span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                </motion.div>

                {/* Camera Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                >
                    <button
                        onClick={() => cameraInputRef.current.click()}
                        className={`w-full p-4 rounded-xl border-2 border-dashed ${
                            darkMode 
                                ? 'border-gray-700 hover:border-gray-600' 
                                : 'border-gray-300 hover:border-gray-400'
                        } flex flex-col items-center justify-center gap-2 transition-colors`}
                        disabled={isLoading}
                    >
                        <FiCamera className="w-6 h-6 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isLoading ? 'Processing...' : 'Take Photo'}
                        </span>
                    </button>
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                </motion.div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            )}
        </div>
    );
} 