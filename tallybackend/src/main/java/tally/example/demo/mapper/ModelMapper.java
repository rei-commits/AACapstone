package tally.example.demo.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import tally.example.demo.dto.BillDTO;
import tally.example.demo.dto.BillItemDTO;
import tally.example.demo.dto.BillParticipantDTO;
import tally.example.demo.dto.UserDTO;
import tally.example.demo.model.Bill;
import tally.example.demo.model.BillItem;
import tally.example.demo.model.BillParticipant;
import tally.example.demo.model.User;

@Component
public class ModelMapper {
    
    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public BillDTO toBillDTO(Bill bill) {
        if (bill == null) return null;
        
        BillDTO dto = new BillDTO();
        dto.setId(bill.getId());
        dto.setName(bill.getName());
        dto.setCreatorId(bill.getCreatorId());
        dto.setPayerId(bill.getPayerId());
        dto.setTax(bill.getTax());
        dto.setTip(bill.getTip());
        dto.setCreatedAt(bill.getCreatedAt());
        
        // Map items
        if (bill.getItems() != null) {
            dto.setItems(bill.getItems().stream()
                .map(this::toBillItemDTO)
                .collect(Collectors.toList()));
        }
        
        // Map participants with more details
        if (bill.getParticipants() != null) {
            dto.setParticipants(bill.getParticipants().stream()
                .map(participant -> {
                    BillParticipantDTO participantDTO = new BillParticipantDTO();
                    participantDTO.setId(participant.getId());
                    participantDTO.setUserId(participant.getUser().getId());
                    participantDTO.setUserName(participant.getUser().getName());
                    participantDTO.setAmount(participant.getAmount());
                    participantDTO.setPaid(participant.getPaid());
                    return participantDTO;
                })
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    public List<BillItemDTO> toBillItemDTOs(List<BillItem> items) {
        if (items == null) return null;
        return items.stream()
            .map(this::toBillItemDTO)
            .collect(Collectors.toList());
    }

    public List<BillParticipantDTO> toBillParticipantDTOs(List<BillParticipant> participants) {
        if (participants == null) return null;
        return participants.stream()
            .map(this::toBillParticipantDTO)
            .collect(Collectors.toList());
    }

    public BillItemDTO toBillItemDTO(BillItem item) {
        if (item == null) return null;
        
        BillItemDTO dto = new BillItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        return dto;
    }

    public BillParticipantDTO toBillParticipantDTO(BillParticipant participant) {
        if (participant == null) return null;
        
        BillParticipantDTO dto = new BillParticipantDTO();
        dto.setId(participant.getId());
        dto.setUserId(participant.getUser().getId());
        dto.setAmount(participant.getAmount());
        dto.setPaid(participant.getPaid());
        return dto;
    }

    public Bill toBill(BillDTO dto) {
        if (dto == null) return null;
        
        Bill bill = new Bill();
        bill.setId(dto.getId());
        bill.setName(dto.getName());
        bill.setCreatorId(dto.getCreatorId());
        bill.setTax(dto.getTax());
        bill.setTip(dto.getTip());
        bill.setCreatedAt(dto.getCreatedAt());
        return bill;
    }

    public List<BillDTO> toBillDTOs(List<Bill> bills) {
        if (bills == null) return null;
        return bills.stream()
            .map(this::toBillDTO)
            .collect(Collectors.toList());
    }

    public List<UserDTO> toUserDTOs(List<User> users) {
        if (users == null) return null;
        return users.stream()
            .map(this::toUserDTO)
            .collect(Collectors.toList());
    }
} 