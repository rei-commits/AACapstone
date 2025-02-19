package tally.example.demo.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import tally.example.demo.model.BillSplit;

@Data
@NoArgsConstructor
public class CreateBillRequest {
    private String name;
    private List<BillItemRequest> items;
    private BigDecimal tax;
    private BigDecimal tip;
    private Long payerId;
    private List<Long> participantIds;
    private List<BillSplit> splits;

    @Data
    @NoArgsConstructor
    public static class BillItemRequest {
        private String name;
        private BigDecimal price;
        private Integer quantity = 1;
    }

    @Data
    @NoArgsConstructor
    public static class BillParticipantRequest {
        private Long userId;
        private BigDecimal amount;
        private Boolean paid = false;
    }
}



