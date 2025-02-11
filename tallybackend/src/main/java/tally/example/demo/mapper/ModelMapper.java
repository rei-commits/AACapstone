package tally.example.demo.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import tally.example.demo.dto.BillDTO;
import tally.example.demo.dto.BillItemDTO;
import tally.example.demo.dto.BillParticipantDTO;
import tally.example.demo.dto.GroupDTO;
import tally.example.demo.dto.UserDTO;
import tally.example.demo.model.Bill;
import tally.example.demo.model.BillItem;
import tally.example.demo.model.BillParticipant;
import tally.example.demo.model.Group;
import tally.example.demo.model.User;

@Component
public class ModelMapper {
    
    private final org.modelmapper.ModelMapper modelMapper;

    public ModelMapper(@Qualifier("dtoModelMapper") org.modelmapper.ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO();
        dto.setUid(user.getUid());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPhotoUrl(user.getPhotoUrl());
        return dto;
    }

    public GroupDTO toGroupDTO(Group group) {
        if (group == null) return null;
        
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setCreator(toUserDTO(group.getCreator()));
        dto.setMembers(group.getMembers().stream()
            .map(this::toUserDTO)
            .collect(Collectors.toList()));
        return dto;
    }

    public BillDTO toBillDTO(Bill bill) {
        return modelMapper.map(bill, BillDTO.class);
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
        dto.setUser(toUserDTO(participant.getUser()));
        dto.setShare(participant.getShare());
        dto.setIsPaid(participant.getIsPaid());
        return dto;
    }

    public Bill toBill(BillDTO dto) {
        if (dto == null) return null;
        
        Bill bill = new Bill();
        bill.setId(dto.getId());
        bill.setTitle(dto.getTitle());
        bill.setTotalAmount(dto.getTotalAmount());
        bill.setDate(dto.getDate());
        return bill;
    }

    public Group toGroup(GroupDTO dto) {
        if (dto == null) return null;
        
        Group group = new Group();
        group.setId(dto.getId());
        group.setName(dto.getName());
        return group;
    }
} 