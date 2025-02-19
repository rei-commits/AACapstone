package tally.example.demo.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tally.example.demo.dto.BillDTO;
import tally.example.demo.dto.BillSummaryDTO;
import tally.example.demo.dto.BillSummaryDTO.ItemSummaryDTO;
import tally.example.demo.dto.BillSummaryDTO.ParticipantSummaryDTO;
import tally.example.demo.dto.request.CreateBillRequest;
import tally.example.demo.dto.response.BillSummaryResponse;
import tally.example.demo.exception.ApiException;
import tally.example.demo.exception.NotFoundException;
import tally.example.demo.mapper.ModelMapper;
import tally.example.demo.model.Bill;
import tally.example.demo.model.BillItem;
import tally.example.demo.model.BillItemAssignment;
import tally.example.demo.model.BillParticipant;
import tally.example.demo.model.BillSplit;
import tally.example.demo.model.User;
import tally.example.demo.repository.BillRepository;
import tally.example.demo.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillService {

    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public BillDTO createBill(CreateBillRequest request, Long userId) {
        log.info("Creating bill with request: {}", request);
        log.info("Splits from request: {}", request.getSplits());
        
        Bill bill = new Bill();
        bill.setName(request.getName());
        bill.setCreatorId(userId);
        bill.setPayerId(request.getPayerId());
        bill.setTax(request.getTax());
        bill.setTip(request.getTip());
        bill.setCreatedAt(LocalDateTime.now());

        // Create and associate items
        List<BillItem> items = request.getItems().stream()
            .map(itemRequest -> {
                BillItem item = new BillItem();
                item.setName(itemRequest.getName());
                item.setPrice(itemRequest.getPrice());
                item.setQuantity(itemRequest.getQuantity());
                item.setBill(bill);
                return item;
            })
            .collect(Collectors.toList());
        bill.setItems(items);

        // Handle participants and splits
        Set<BillParticipant> participants = new HashSet<>();
        if (request.getSplits() != null && !request.getSplits().isEmpty()) {
            for (BillSplit split : request.getSplits()) {
                log.info("Processing split for userId: {}", split.getUserId());
                
                User participant = userRepository.findById(split.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + split.getUserId()));
                
                log.info("Found user: {}", participant.getName());
                
                BillParticipant billParticipant = new BillParticipant();
                billParticipant.setBill(bill);
                billParticipant.setUser(participant);
                billParticipant.setAmount(split.getAmount());
                billParticipant.setPaid(false);
                participants.add(billParticipant);
                
                log.info("Added participant {} with amount {}", 
                    participant.getName(), split.getAmount());
            }
        }

        bill.setParticipants(participants);
        Bill savedBill = billRepository.save(bill);
        
        log.info("Bill saved. Participants count: {}", savedBill.getParticipants().size());
        savedBill.getParticipants().forEach(p -> 
            log.info("Participant: {} with amount {}", p.getUser().getName(), p.getAmount())
        );
        
        BillDTO dto = modelMapper.toBillDTO(savedBill);
        log.info("Converted to DTO. Participants count: {}", 
            dto.getParticipants() != null ? dto.getParticipants().size() : 0);
        
        return dto;
    }

    public List<BillDTO> getUserBills(Long userId) {
        log.info("Getting bills for user ID: {}", userId);
        
        List<Bill> bills = billRepository.findByCreatorIdOrParticipantUserId(userId);
        log.info("Found {} bills in database", bills.size());
        
        bills.forEach(bill -> {
            log.info("Bill: id={}, name={}, creatorId={}, payerId={}, items={}, participants={}",
                bill.getId(),
                bill.getName(),
                bill.getCreatorId(),
                bill.getPayerId(),
                bill.getItems().size(),
                bill.getParticipants().size()
            );
        });
        
        List<BillDTO> dtos = bills.stream()
            .map(modelMapper::toBillDTO)
            .collect(Collectors.toList());
            
        log.info("Converted to {} DTOs", dtos.size());
        return dtos;
    }

    public BillDTO getBill(Long id) {
        Bill bill = billRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Bill not found"));
        return modelMapper.toBillDTO(bill);
    }

    public BillSummaryResponse getBillSummary(Long billId) {
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Bill not found"));

        BillSummaryResponse summary = new BillSummaryResponse();
        
        // Use user ID instead of firebaseUid
        summary.setUserShares(bill.getParticipants().stream()
            .collect(Collectors.toMap(
                p -> p.getUser().getId().toString(),
                BillParticipant::getAmount
            )));

        summary.setPaidStatus(bill.getParticipants().stream()
            .collect(Collectors.toMap(
                p -> p.getUser().getId().toString(),
                BillParticipant::getPaid
            )));

        return summary;
    }

    @Transactional
    public void markParticipantAsPaid(Long billId, Long userId) {
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new NotFoundException("Bill not found"));
            
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));

        bill.getParticipants().stream()
            .filter(p -> p.getUser().getId().equals(user.getId()))
            .findFirst()
            .ifPresent(participant -> participant.setPaid(true));

        billRepository.save(bill);
    }

    @Transactional
    public void deleteBill(Long billId, Long userId) {
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new NotFoundException("Bill not found"));
            
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));
        
        if (!bill.getCreatorId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the bill creator can delete the bill");
        }

        billRepository.delete(bill);
    }

    public List<Bill> getBillsForUser(Long userId) {
        return billRepository.findByCreatorIdOrParticipantUserId(userId);
    }

    public BillSummaryDTO calculateBillSplit(Long billId) {
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new NotFoundException("Bill not found"));

        BillSummaryDTO summary = new BillSummaryDTO();
        summary.setBillId(bill.getId());
        summary.setBillName(bill.getName());
        summary.setTax(bill.getTax());
        summary.setTip(bill.getTip());

        // Calculate total amount
        BigDecimal itemsTotal = bill.getItems().stream()
            .map(BillItem::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        summary.setTotalAmount(itemsTotal.add(bill.getTax()).add(bill.getTip()));

        // Calculate per-participant summaries
        Map<Long, ParticipantSummaryDTO> participantSummaries = new HashMap<>();

        // Process item assignments
        for (BillItem item : bill.getItems()) {
            for (BillItemAssignment assignment : item.getAssignments()) {
                User user = assignment.getUser();
                ParticipantSummaryDTO participantSummary = participantSummaries
                    .computeIfAbsent(user.getId(), id -> {
                        ParticipantSummaryDTO ps = new ParticipantSummaryDTO();
                        ps.setUserId(user.getId());
                        ps.setName(user.getName());
                        return ps;
                    });

                ItemSummaryDTO itemSummary = new ItemSummaryDTO();
                itemSummary.setItemName(item.getName());
                itemSummary.setPrice(item.getPrice());
                itemSummary.setQuantity(item.getQuantity());
                itemSummary.setPortion(assignment.getPortion());
                
                BigDecimal shareAmount = item.getTotalPrice()
                    .multiply(BigDecimal.valueOf(assignment.getPortion()));
                itemSummary.setShareAmount(shareAmount);
                
                participantSummary.getItems().add(itemSummary);
                participantSummary.setSubtotal(
                    participantSummary.getSubtotal().add(shareAmount));
            }
        }

        // Calculate tax and tip shares
        int participantCount = participantSummaries.size();
        if (participantCount > 0) {
            BigDecimal taxShare = bill.getTax()
                .divide(BigDecimal.valueOf(participantCount), 2, RoundingMode.HALF_UP);
            BigDecimal tipShare = bill.getTip()
                .divide(BigDecimal.valueOf(participantCount), 2, RoundingMode.HALF_UP);

            participantSummaries.values().forEach(ps -> {
                ps.setTaxShare(taxShare);
                ps.setTipShare(tipShare);
                ps.setTotal(ps.getSubtotal().add(taxShare).add(tipShare));
                
                // Set paid status from BillParticipant
                bill.getParticipants().stream()
                    .filter(bp -> bp.getUser().getId().equals(ps.getUserId()))
                    .findFirst()
                    .ifPresent(bp -> ps.setPaid(bp.getPaid()));
            });
        }

        summary.setParticipants(new ArrayList<>(participantSummaries.values()));
        return summary;
    }
} 