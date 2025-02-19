package tally.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import tally.example.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByIdIn(List<Long> ids);
    
    @Override
    @NonNull
    Optional<User> findById(@NonNull Long id);

    // Add any custom query methods here if needed
} 