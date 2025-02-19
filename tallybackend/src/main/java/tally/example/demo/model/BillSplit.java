package tally.example.demo.model;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BillSplit {
    private Long userId;
    private BigDecimal amount;
} 