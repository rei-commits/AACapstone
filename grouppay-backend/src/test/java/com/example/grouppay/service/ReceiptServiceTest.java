package com.example.grouppay.service;

import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.example.grouppay.model.Bill;
import com.example.grouppay.model.Receipt;
import com.example.grouppay.repository.BillRepository;
import com.example.grouppay.repository.ReceiptRepository;

class ReceiptServiceTest {
    
    private ReceiptService receiptService;
    private BillRepository billRepository;
    private ReceiptRepository receiptRepository;
    
    @BeforeEach
    void setUp() {
        billRepository = mock(BillRepository.class);
        receiptRepository = mock(ReceiptRepository.class);
        receiptService = new ReceiptService();
        // Set mocked repositories
        setField(receiptService, "billRepository", billRepository);
        setField(receiptService, "receiptRepository", receiptRepository);
    }
    
    @Test
    void testValidImageUpload() throws IOException {
        // Create test data
        Bill bill = new Bill();
        bill.setId(1L);
        
        // Create a mock image file
        InputStream imageStream = getClass().getResourceAsStream("/test-receipt.jpg");
        MultipartFile file = new MockMultipartFile(
            "receipt.jpg",
            "receipt.jpg",
            "image/jpeg",
            imageStream != null ? imageStream.readAllBytes() : new byte[0]
        );
        
        // Mock repository responses
        when(billRepository.findById(1L)).thenReturn(java.util.Optional.of(bill));
        when(receiptRepository.save(any(Receipt.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Test the service
        Receipt savedReceipt = receiptService.saveReceipt(file, 1L, "Test Merchant");
        
        // Verify
        assertNotNull(savedReceipt);
        assertNotNull(savedReceipt.getImageData());
        assertEquals("Test Merchant", savedReceipt.getMerchantName());
        assertEquals(bill, savedReceipt.getBill());
    }
    
    @Test
    void testInvalidFileType() {
        // Create an invalid file type
        MultipartFile file = new MockMultipartFile(
            "receipt.txt",
            "receipt.txt",
            "text/plain",
            "test content".getBytes()
        );
        
        // Test and verify exception
        assertThrows(IllegalArgumentException.class, () -> 
            receiptService.saveReceipt(file, 1L, "Test Merchant")
        );
    }
    
    @Test
    void testFileTooLarge() {
        // Create a file larger than 5MB
        byte[] largeContent = new byte[6 * 1024 * 1024];
        MultipartFile file = new MockMultipartFile(
            "receipt.jpg",
            "receipt.jpg",
            "image/jpeg",
            largeContent
        );
        
        // Test and verify exception
        assertThrows(IllegalArgumentException.class, () -> 
            receiptService.saveReceipt(file, 1L, "Test Merchant")
        );
    }
    
    // Utility method to set private fields
    private void setField(Object target, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
} 