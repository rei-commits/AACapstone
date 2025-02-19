package tally.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import tally.example.demo.model.Bill;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    @Override
    @NonNull
    Optional<Bill> findById(@NonNull Long id);

    @Query("SELECT DISTINCT b FROM Bill b " +
           "LEFT JOIN FETCH b.items " +
           "LEFT JOIN FETCH b.participants p " +
           "LEFT JOIN FETCH p.user " +
           "WHERE b.creatorId = :userId OR p.user.id = :userId")
    List<Bill> findByCreatorIdOrParticipantUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Bill b SET b.creatorId = :newId WHERE b.creatorId = :oldId")
    void updateCreatorUid(@Param("oldId") Long oldId, @Param("newId") Long newId);
} 