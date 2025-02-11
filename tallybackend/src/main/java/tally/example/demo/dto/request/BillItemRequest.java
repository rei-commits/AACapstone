package tally.example.demo.dto.request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BillItemRequest {
    private String name;
    private BigDecimal price;
    private Integer quantity;
} 