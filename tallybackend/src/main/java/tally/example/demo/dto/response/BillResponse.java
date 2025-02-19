package tally.example.demo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class BillResponse {
    private Long id;
    private String title;
    private String receiptUrl;
    private BigDecimal total;
    private LocalDateTime createdAt;
    private String createdBy;
    private List<BillItemResponse> items;
    private List<UserResponse> participants;
} 