package tally.example.demo.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class CreateBillRequest {
    private String title;
    private BigDecimal totalAmount;
    private Long groupId;
    private List<BillItemRequest> items;
    private List<BillParticipantRequest> participants;
}

