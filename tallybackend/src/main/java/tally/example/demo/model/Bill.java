package tally.example.demo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(name = "creator_id")
    private Long creatorId;

    @Column(name = "payer_id")
    private Long payerId;

    @Column(precision = 10, scale = 2)
    private BigDecimal tax;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal tip;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @JsonManagedReference
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<BillItem> items = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<BillParticipant> participants = new HashSet<>();

    @Override
    public int hashCode() {
        return Objects.hash(id, name, creatorId, tax, tip, createdAt);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Bill)) return false;
        Bill bill = (Bill) o;
        return Objects.equals(id, bill.id);
    }
} 