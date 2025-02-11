package tally.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import tally.example.demo.dto.BillDTO;
import tally.example.demo.dto.ReceiptScanResult;
import tally.example.demo.dto.request.CreateBillRequest;
import tally.example.demo.mapper.ModelMapper;
import tally.example.demo.model.Bill;
import tally.example.demo.service.BillService;
import tally.example.demo.service.OcrService;
import tally.example.demo.service.UserService;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private static final Logger logger = LoggerFactory.getLogger(BillController.class);

    @Autowired
    private BillService billService;

    @Autowired
    private UserService userService;

    @Autowired
    private OcrService ocrService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<BillDTO> createBill(@RequestBody CreateBillRequest request, Authentication auth) {
        String userId = auth.getName();
        BillDTO bill = billService.createBillFromRequest(request, userId);
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/me")
    public ResponseEntity<List<BillDTO>> getMyBills(Authentication auth) {
        String userId = auth.getName();
        List<Bill> bills = billService.getUserBills(userService.getCurrentUser(userId));
        List<BillDTO> billDTOs = bills.stream()
            .map(modelMapper::toBillDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(billDTOs);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<BillDTO>> getBillsByGroup(@PathVariable Long groupId) {
        List<BillDTO> bills = billService.getBillsByGroup(groupId);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDTO> getBill(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);
        return ResponseEntity.ok(modelMapper.toBillDTO(bill));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<BillDTO> markAsPaid(@PathVariable Long id, Authentication auth) {
        String userId = auth.getName();
        Bill bill = billService.markParticipantAsPaid(id, userId);
        return ResponseEntity.ok(modelMapper.toBillDTO(bill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id, Authentication auth) {
        String userId = auth.getName();
        billService.deleteBill(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/scan")
    public ResponseEntity<ReceiptScanResult> scanReceipt(@RequestParam("file") MultipartFile file) {
        try {
            logger.info("Received file upload request");
            logger.info("File details - Name: {}, Size: {}, Content Type: {}", 
                file.getOriginalFilename(), file.getSize(), file.getContentType());
            
            ReceiptScanResult result = ocrService.scanReceipt(file);
            logger.info("Successfully processed receipt. Found {} items", 
                result.getItems() != null ? result.getItems().size() : 0);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing receipt: ", e);
            String errorMessage = e.getMessage() + (e.getCause() != null ? " Caused by: " + e.getCause().getMessage() : "");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ReceiptScanResult(errorMessage));
        }
    }
} 