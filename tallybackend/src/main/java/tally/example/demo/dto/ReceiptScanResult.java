package tally.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import tally.example.demo.model.BillItem;

@Data
public class ReceiptScanResult {
    private List<BillItem> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private String error;

    public ReceiptScanResult() {
    }

    public ReceiptScanResult(String error) {
        this.error = error;
    }

    public List<BillItem> getItems() {
        return items;
    }

    public void setItems(List<BillItem> items) {
        this.items = items;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
} 