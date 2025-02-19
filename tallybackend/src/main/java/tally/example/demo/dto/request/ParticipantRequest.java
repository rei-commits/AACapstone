package tally.example.demo.dto.request;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ParticipantRequest {
    private String userId;
    private BigDecimal share;
} 