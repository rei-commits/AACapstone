package tally.example.demo.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BillParticipantDTO {
    private String userId;
    private BigDecimal amount;
    private Boolean paid;
} 