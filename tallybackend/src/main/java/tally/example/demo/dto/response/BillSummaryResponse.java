package tally.example.demo.dto.response;

import java.math.BigDecimal;
import java.util.Map;

import lombok.Data;

@Data
public class BillSummaryResponse {
    private Map<String, BigDecimal> userShares;
    private Map<String, Boolean> paymentStatus;
} 