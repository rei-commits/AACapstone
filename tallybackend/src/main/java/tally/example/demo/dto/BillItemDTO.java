package tally.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BillItemDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private List<Long> assignedUserIds;
} 