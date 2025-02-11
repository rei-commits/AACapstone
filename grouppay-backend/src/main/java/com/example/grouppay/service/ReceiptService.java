package com.example.grouppay.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.grouppay.exception.ImageProcessingException;
import com.example.grouppay.exception.ImageProcessingException.ErrorCodes;
import com.example.grouppay.exception.ResourceNotFoundException;
import com.example.grouppay.model.Bill;
import com.example.grouppay.model.Receipt;
import com.example.grouppay.repository.BillRepository;
import com.example.grouppay.repository.ReceiptRepository;

@Service
@Transactional
public class ReceiptService {
    @Autowired
    private ReceiptRepository receiptRepository;
    
    @Autowired
    private BillRepository billRepository;

    // Maximum file size (5MB)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    
    // Minimum file size (1KB)
    private static final long MIN_FILE_SIZE = 1024;
    
    // Allowed image types
    private static final Set<String> ALLOWED_TYPES = new HashSet<>(
        Arrays.asList("image/jpeg", "image/png", "image/heic", "image/heif")
    );
    
    public Receipt saveReceipt(MultipartFile file, Long billId, String merchantName) throws IOException {
        validateFile(file);
        
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + billId));
            
        Receipt receipt = new Receipt();
        receipt.setBill(bill);
        
        try {
            byte[] imageData = file.getBytes();
            validateImageContent(imageData);
            receipt.setImageData(imageData);
            receipt.setMerchantName(merchantName);
            receipt.setReceiptDate(LocalDateTime.now());
            
            return receiptRepository.save(receipt);
        } catch (IOException e) {
            throw new ImageProcessingException(
                "Failed to process image data", 
                ErrorCodes.PROCESSING_ERROR,
                e
            );
        }
    }
    
    private void validateFile(MultipartFile file) {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new ImageProcessingException(
                "File is empty",
                ErrorCodes.EMPTY_FILE
            );
        }
        
        // Validate file size
        long size = file.getSize();
        if (size > MAX_FILE_SIZE) {
            throw new ImageProcessingException(
                "File size exceeds maximum limit of 5MB",
                ErrorCodes.FILE_TOO_LARGE
            );
        }
        
        if (size < MIN_FILE_SIZE) {
            throw new ImageProcessingException(
                "File size is too small (minimum 1KB)",
                ErrorCodes.CORRUPTED_IMAGE
            );
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new ImageProcessingException(
                "Invalid file type. Allowed types: JPEG, PNG, HEIC/HEIF",
                ErrorCodes.INVALID_FILE_TYPE
            );
        }
    }
    
    private void validateImageContent(byte[] imageData) throws IOException {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(imageData)) {
            BufferedImage image = ImageIO.read(bis);
            if (image == null) {
                throw new ImageProcessingException(
                    "Invalid or corrupted image data",
                    ErrorCodes.CORRUPTED_IMAGE
                );
            }
            
            // Check minimum dimensions (e.g., 100x100 pixels)
            if (image.getWidth() < 100 || image.getHeight() < 100) {
                throw new ImageProcessingException(
                    "Image dimensions too small (minimum 100x100 pixels)",
                    ErrorCodes.CORRUPTED_IMAGE
                );
            }
        } catch (IOException e) {
            throw new ImageProcessingException(
                "Failed to validate image content",
                ErrorCodes.CORRUPTED_IMAGE,
                e
            );
        }
    }
    
    public Receipt getReceipt(Long id) {
        return receiptRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with id: " + id));
    }
    
    public List<Receipt> getReceiptsByBillId(Long billId) {
        return receiptRepository.findByBillId(billId);
    }
    
    public byte[] getReceiptImage(Long id) {
        Receipt receipt = getReceipt(id);
        if (receipt.getImageData() == null || receipt.getImageData().length == 0) {
            throw new ImageProcessingException(
                "No image data found for receipt",
                ErrorCodes.EMPTY_FILE
            );
        }
        return receipt.getImageData();
    }
    
    public void deleteReceipt(Long id) {
        Receipt receipt = getReceipt(id);
        receiptRepository.delete(receipt);
    }
} 