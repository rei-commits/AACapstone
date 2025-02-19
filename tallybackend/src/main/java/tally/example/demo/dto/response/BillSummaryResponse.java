package tally.example.demo.dto.response;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BillSummaryResponse {
    private Map<String, BigDecimal> userShares = new HashMap<>();
    private Map<String, Boolean> paidStatus = new HashMap<>();
} 