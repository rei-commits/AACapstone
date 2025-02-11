package tally.example.demo.dto.request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BillParticipantRequest {
    private String userId;
    private BigDecimal share;
} 