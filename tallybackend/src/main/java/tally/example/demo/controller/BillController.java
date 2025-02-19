package tally.example.demo.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tally.example.demo.dto.BillDTO;
import tally.example.demo.dto.request.CreateBillRequest;
import tally.example.demo.dto.response.BillSummaryResponse;
import tally.example.demo.model.Bill;
import tally.example.demo.repository.BillRepository;
import tally.example.demo.service.BillService;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@Slf4j
public class BillController {
    private final BillService billService;
    private final BillRepository billRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createBill(
            @RequestBody CreateBillRequest request,
            @RequestParam Long userId) {
        try {
            log.info("Received create bill request from user: {}", userId);
            log.info("Request body: {}", request);
            
            // Log the state of the database before creation
            log.info("Current bill count before creation: {}", billRepository.count());
            
            BillDTO bill = billService.createBill(request, userId);
            
            // Log the state after creation
            log.info("Bill created successfully with ID: {}", bill.getId());
            log.info("Current bill count after creation: {}", billRepository.count());
            
            return ResponseEntity.ok(bill);
        } catch (Exception e) {
            log.error("Error creating bill: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserBills(@RequestParam Long userId) {
        try {
            log.info("Fetching bills for user: {}", userId);
            List<BillDTO> bills = billService.getUserBills(userId);
            log.info("Found {} bills", bills.size());
            log.info("Bills: {}", bills);
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            log.error("Error fetching bills: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/test-connection")
    public ResponseEntity<?> testConnection(@RequestParam Long userId) {
        try {
            log.info("Testing connection for user: {}", userId);
            
            long billCount = billRepository.count();
            log.info("Total bills in database: {}", billCount);
            
            List<Bill> bills = billRepository.findByCreatorIdOrParticipantUserId(userId);
            log.info("Found {} bills for user {}", bills.size(), userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalBills", billCount);
            response.put("userBills", bills.size());
            response.put("databaseConnected", true);
            response.put("testBills", bills);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Connection test failed: ", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", e.getMessage(),
                    "databaseConnected", false
                ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDTO> getBill(
            @PathVariable Long id,
            @RequestParam Long userId) {
        log.info("Getting bill {} for user {}", id, userId);
        BillDTO bill = billService.getBill(id);
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<BillSummaryResponse> getBillSummary(@PathVariable Long id) {
        BillSummaryResponse summary = billService.getBillSummary(id);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Void> markAsPaid(
            @PathVariable Long id,
            @RequestParam Long userId) {
        billService.markParticipantAsPaid(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(
            @PathVariable Long id,
            @RequestParam Long userId) {
        billService.deleteBill(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugBills(@RequestParam Long userId) {
        log.info("Debug bills for user: {}", userId);
        Map<String, Object> debug = new HashMap<>();
        try {
            List<Bill> bills = billRepository.findByCreatorIdOrParticipantUserId(userId);
            debug.put("totalBills", bills.size());
            debug.put("bills", bills);
            
            debug.put("requestedUid", userId);
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            log.error("Error in debug endpoint", e);
            debug.put("error", e.getMessage());
            return ResponseEntity.ok(debug);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testDatabaseConnection() {
        try {
            // Try to insert a test bill
            Bill testBill = new Bill();
            testBill.setName("Test Bill");
            testBill.setCreatorId(1L);
            testBill.setTax(new BigDecimal("1.00"));
            testBill.setTip(new BigDecimal("1.00"));
            testBill.setCreatedAt(LocalDateTime.now());
            
            Bill savedBill = billRepository.save(testBill);
            log.info("Test bill saved with ID: {}", savedBill.getId());
            
            // Clean up
            billRepository.delete(savedBill);
            
            return ResponseEntity.ok("Database connection test successful");
        } catch (Exception e) {
            log.error("Database test failed: ", e);
            return ResponseEntity.status(500).body("Database test failed: " + e.getMessage());
        }
    }

    @PutMapping("/updateCreatorUid")
    public ResponseEntity<?> updateCreatorUid(
        @RequestParam Long oldUserId,
        @RequestParam Long newUserId) {
        try {
            billRepository.updateCreatorUid(oldUserId, newUserId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/debug/all")
    public ResponseEntity<?> getAllBills() {
        try {
            List<Bill> allBills = billRepository.findAll();
            log.info("Total bills in database: {}", allBills.size());
            return ResponseEntity.ok(allBills);
        } catch (Exception e) {
            log.error("Error fetching all bills: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
} 