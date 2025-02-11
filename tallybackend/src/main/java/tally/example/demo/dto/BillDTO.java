package tally.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class BillDTO {
    private Long id;
    private String title;
    private BigDecimal totalAmount;
    private LocalDateTime date;
    private UserDTO creator;
    private GroupDTO group;
    private List<BillItemDTO> items;
    private List<BillParticipantDTO> participants;
} 