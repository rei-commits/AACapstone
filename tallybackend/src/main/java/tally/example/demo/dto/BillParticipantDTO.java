package tally.example.demo.dto;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BillParticipantDTO {
    private Long id;
    private Long userId;
    private String userName;
    private BigDecimal amount;
    private Boolean paid;
} 