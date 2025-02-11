package com.example.grouppay.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.grouppay.model.Receipt;
import com.example.grouppay.service.ReceiptService;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "http://localhost:3000")
public class ReceiptController {
    @Autowired
    private ReceiptService receiptService;
    
    @PostMapping
    public ResponseEntity<Receipt> uploadReceipt(
            @RequestParam("file") MultipartFile file,
            @RequestParam("billId") Long billId,
            @RequestParam("merchantName") String merchantName) throws IOException {
        Receipt receipt = receiptService.saveReceipt(file, billId, merchantName);
        return ResponseEntity.ok(receipt);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceipt(@PathVariable Long id) {
        Receipt receipt = receiptService.getReceipt(id);
        return ResponseEntity.ok(receipt);
    }
    
    @GetMapping("/bill/{billId}")
    public ResponseEntity<List<Receipt>> getReceiptsByBillId(@PathVariable Long billId) {
        List<Receipt> receipts = receiptService.getReceiptsByBillId(billId);
        return ResponseEntity.ok(receipts);
    }
    
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getReceiptImage(@PathVariable Long id) {
        byte[] imageData = receiptService.getReceiptImage(id);
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(imageData);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
        return ResponseEntity.ok().build();
    }
} 