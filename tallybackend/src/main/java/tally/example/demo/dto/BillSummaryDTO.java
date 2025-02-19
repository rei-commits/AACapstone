package tally.example.demo.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class BillSummaryDTO {
    private Long billId;
    private String billName;
    private List<ParticipantSummaryDTO> participants = new ArrayList<>();
    private BigDecimal totalAmount;
    private BigDecimal tax;
    private BigDecimal tip;

    @Data
    public static class ParticipantSummaryDTO {
        private Long userId;
        private String name;
        private List<ItemSummaryDTO> items = new ArrayList<>();
        private BigDecimal subtotal = BigDecimal.ZERO;
        private BigDecimal taxShare;
        private BigDecimal tipShare;
        private BigDecimal total;
        private boolean paid;
    }

    @Data
    public static class ItemSummaryDTO {
        private String itemName;
        private BigDecimal price;
        private Integer quantity;
        private Double portion;
        private BigDecimal shareAmount;
    }
} 