package tally.example.demo.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BillParticipantDTO {
    private Long id;
    private UserDTO user;
    private BigDecimal share;
    private Boolean isPaid;
} 