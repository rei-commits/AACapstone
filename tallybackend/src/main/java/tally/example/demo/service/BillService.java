package tally.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tally.example.demo.dto.BillDTO;
import tally.example.demo.dto.request.BillItemRequest;
import tally.example.demo.dto.request.BillParticipantRequest;
import tally.example.demo.dto.request.CreateBillRequest;
import tally.example.demo.dto.response.BillSummaryResponse;
import tally.example.demo.exception.ApiException;
import tally.example.demo.model.Bill;
import tally.example.demo.model.BillItem;
import tally.example.demo.model.BillParticipant;
import tally.example.demo.model.Group;
import tally.example.demo.model.User;
import tally.example.demo.repository.BillRepository;
import tally.example.demo.repository.GroupRepository;
import tally.example.demo.repository.UserRepository;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private tally.example.demo.mapper.ModelMapper modelMapper;

    @Transactional
    public BillDTO createBillFromRequest(CreateBillRequest request, String userId) {
        Bill bill = new Bill();
        bill.setTitle(request.getTitle());
        bill.setTotalAmount(request.getTotalAmount());
        bill.setDate(LocalDateTime.now());

        User creator = userRepository.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        bill.setCreator(creator);

        Group group = groupRepository.findById(request.getGroupId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Group not found"));
        bill.setGroup(group);

        // Process items
        for (BillItemRequest itemRequest : request.getItems()) {
            BillItem item = new BillItem();
            item.setName(itemRequest.getName());
            item.setPrice(itemRequest.getPrice());
            item.setQuantity(itemRequest.getQuantity());
            item.setBill(bill);
            bill.getItems().add(item);
        }

        // Process participants
        for (BillParticipantRequest participantRequest : request.getParticipants()) {
            User user = userRepository.findById(participantRequest.getUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

            BillParticipant participant = new BillParticipant();
            participant.setUser(user);
            participant.setShare(participantRequest.getShare());
            participant.setIsPaid(false);
            participant.setBill(bill);
            bill.getParticipants().add(participant);
        }

        bill = billRepository.save(bill);
        return modelMapper.toBillDTO(bill);
    }

    public List<BillDTO> getBillsByGroup(Long groupId) {
        return billRepository.findByGroupId(groupId).stream()
            .map(modelMapper::toBillDTO)
            .collect(Collectors.toList());
    }

    public List<Bill> getUserBills(User user) {
        return billRepository.findByParticipantsUserOrCreator(user, user);
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Bill not found"));
    }

    public BillSummaryResponse getBillSummary(Long billId) {
        Bill bill = getBillById(billId);
        BillSummaryResponse summary = new BillSummaryResponse();

        // Calculate user shares
        Map<String, BigDecimal> userShares = bill.getParticipants().stream()
            .collect(Collectors.toMap(
                p -> p.getUser().getUid(),
                BillParticipant::getShare
            ));
        summary.setUserShares(userShares);

        // Get payment status
        Map<String, Boolean> paymentStatus = bill.getParticipants().stream()
            .collect(Collectors.toMap(
                p -> p.getUser().getUid(),
                BillParticipant::getIsPaid
            ));
        summary.setPaymentStatus(paymentStatus);

        return summary;
    }

    @Transactional
    public Bill markParticipantAsPaid(Long billId, String userId) {
        Bill bill = getBillById(billId);
        
        if (!bill.getCreator().getUid().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the bill creator can mark payments as paid");
        }

        bill.getParticipants().stream()
            .filter(p -> p.getUser().getUid().equals(userId))
            .findFirst()
            .ifPresent(participant -> participant.setIsPaid(true));

        return billRepository.save(bill);
    }

    @Transactional
    public void deleteBill(Long billId, String userId) {
        Bill bill = getBillById(billId);
        
        if (!bill.getCreator().getUid().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the bill creator can delete the bill");
        }

        billRepository.delete(bill);
    }
} 