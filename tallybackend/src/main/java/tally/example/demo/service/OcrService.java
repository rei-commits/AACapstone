package tally.example.demo.service;

import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import net.sourceforge.tess4j.Tesseract;
import tally.example.demo.dto.ReceiptScanResult;
import tally.example.demo.model.BillItem;

@Service
public class OcrService {
    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);
    private Tesseract tesseract;

    @Value("${app.tesseract.dataPath:/usr/local/share/tessdata}")
    private String tesseractDataPath;

    @PostConstruct
    public void init() {
        try {
            // Set system properties for Tesseract
            System.setProperty("jna.library.path", "/opt/homebrew/lib:/usr/local/lib");
            System.setProperty("TESSDATA_PREFIX", tesseractDataPath);
            
            // Initialize Tesseract
            tesseract = new Tesseract();
            tesseract.setDatapath(tesseractDataPath);
            
            // Configure Tesseract settings
            tesseract.setLanguage("eng");
            tesseract.setPageSegMode(1);
            tesseract.setOcrEngineMode(1);
            
            logger.info("Tesseract initialized with data path: {}", tesseractDataPath);
        } catch (Exception e) {
            logger.error("Failed to initialize Tesseract", e);
            throw new RuntimeException("Failed to initialize OCR service", e);
        }
    }

    public ReceiptScanResult scanReceipt(MultipartFile file) {
        File tempFile = null;
        try {
            // Create temp file
            tempFile = File.createTempFile("receipt_", getFileExtension(file.getOriginalFilename()));
            file.transferTo(tempFile);
            
            // Perform OCR
            String result = tesseract.doOCR(tempFile);
            return processOcrResult(result);
            
        } catch (Exception e) {
            logger.error("Error processing receipt", e);
            throw new RuntimeException("Failed to process receipt: " + e.getMessage(), e);
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    private String getFileExtension(String filename) {
        return filename != null && filename.contains(".") 
            ? filename.substring(filename.lastIndexOf(".")) 
            : ".tmp";
    }

    private ReceiptScanResult processOcrResult(String text) {
        List<BillItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal total = BigDecimal.ZERO;

        String[] lines = text.split("\n");
        Pattern pricePattern = Pattern.compile("\\$?(\\d+\\.\\d{2})");

        for (String line : lines) {
            Matcher matcher = pricePattern.matcher(line);
            if (matcher.find()) {
                BigDecimal price = new BigDecimal(matcher.group(1));
                String itemName = line.replaceAll("\\$?\\d+\\.\\d{2}", "").trim();

                if (!itemName.toLowerCase().contains("total") && 
                    !itemName.toLowerCase().contains("tax")) {
                    BillItem item = new BillItem();
                    item.setName(itemName);
                    item.setPrice(price);
                    item.setQuantity(1);
                    items.add(item);
                    subtotal = subtotal.add(price);
                } else if (itemName.toLowerCase().contains("tax")) {
                    tax = price;
                } else if (itemName.toLowerCase().contains("total")) {
                    total = price;
                }
            }
        }

        if (total.equals(BigDecimal.ZERO)) {
            total = subtotal.add(tax);
        }

        ReceiptScanResult result = new ReceiptScanResult();
        result.setItems(items);
        result.setSubtotal(subtotal);
        result.setTax(tax);
        result.setTotal(total);
        return result;
    }
} 