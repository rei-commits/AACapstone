import React, { useState } from 'react';
import { FiUpload, FiX, FiAlertCircle } from 'react-icons/fi';
import { receiptService } from '../services/receiptService';

const ReceiptUpload = ({ onUpload, billId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Error messages mapping
    const errorMessages = {
        IMG_001: "File is too large. Maximum size is 5MB.",
        IMG_002: "Invalid file type. Please upload a JPEG, PNG, or HEIC/HEIF image.",
        IMG_003: "The image appears to be corrupted or invalid.",
        IMG_004: "Please select a file to upload.",
        IMG_005: "Failed to process the image. Please try again.",
        DEFAULT: "An unexpected error occurred. Please try again."
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setError(null);

        // Client-side validation
        if (!file) {
            setError(errorMessages.IMG_004);
            return;
        }

        // Check file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError(errorMessages.IMG_001);
            return;
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
        if (!validTypes.includes(file.type.toLowerCase())) {
            setError(errorMessages.IMG_002);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError(errorMessages.IMG_004);
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const data = await receiptService.uploadReceipt(selectedFile, billId);
            onUpload(data);
            resetForm();
        } catch (err) {
            setError(err.message || errorMessages.DEFAULT);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreview(null);
        setError(null);
    };

    return (
        <div className="p-4 bg-[#1C1C28] rounded-xl border border-purple-500/10">
            {/* Upload Area */}
            <div className="mb-4">
                <label 
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer
                        ${error ? 'border-red-500 bg-red-500/5' : 'border-purple-500/50 hover:border-purple-500 bg-[#2D2D3D]'}
                        transition-all duration-200`}
                >
                    <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/heic,image/heif"
                        onChange={handleFileSelect}
                    />
                    
                    {preview ? (
                        <div className="relative w-full h-full">
                            <img 
                                src={preview} 
                                alt="Receipt preview" 
                                className="w-full h-full object-contain rounded-lg"
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    resetForm();
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <FiUpload className="w-8 h-8 text-purple-500 mb-2" />
                            <p className="text-sm text-gray-400">
                                Click or drag receipt to upload
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                JPEG, PNG, or HEIC/HEIF (max. 5MB)
                            </p>
                        </div>
                    )}
                </label>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                    <FiAlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2
                    ${selectedFile && !isUploading
                        ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/20'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    } transition-all duration-200`}
            >
                {isUploading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                    </>
                ) : (
                    <>
                        <FiUpload className="w-4 h-4" />
                        <span>Upload Receipt</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default ReceiptUpload; 