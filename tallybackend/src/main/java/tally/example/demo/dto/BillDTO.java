package tally.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillDTO {
    private Long id;
    private String name;
    private Long creatorId;
    private Long payerId;
    private BigDecimal tax;
    private BigDecimal tip;
    private LocalDateTime createdAt;
    private List<BillItemDTO> items = new ArrayList<>();
    private List<BillParticipantDTO> participants = new ArrayList<>();
} 