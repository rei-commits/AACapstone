package tally.example.demo.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BillItemDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
} 