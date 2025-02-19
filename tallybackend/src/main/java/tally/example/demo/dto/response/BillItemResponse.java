package tally.example.demo.dto.response;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BillItemResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
} 