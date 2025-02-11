package tally.example.demo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private BigDecimal totalAmount;
    private LocalDateTime date;

    @ManyToOne
    private User creator;

    @ManyToOne
    private Group group;

    @OneToMany(mappedBy = "bill")
    private List<BillItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "bill")
    private List<BillParticipant> participants = new ArrayList<>();
} 