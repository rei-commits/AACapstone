package com.example.grouppay.repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.example.grouppay.model.User;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindByEmail_thenReturnUser() {
        // given
        User user = new User();
        user.setFullName("John Doe");
        user.setEmail("john@example.com");
        user.setPassword("password");
        entityManager.persist(user);
        entityManager.flush();

        // when
        Optional<User> found = userRepository.findByEmail(user.getEmail());

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo(user.getEmail());
    }

    @ParameterizedTest
    @MethodSource("provideSearchTerms")
    public void whenSearchByName_thenReturnMatchingUsers(String searchTerm, String[] expectedNames) {
        // given
        User user1 = createUser("John Doe", "john@example.com");
        User user2 = createUser("Jane Doe", "jane@example.com");
        User user3 = createUser("Bob Smith", "bob@example.com");

        entityManager.persist(user1);
        entityManager.persist(user2);
        entityManager.persist(user3);
        entityManager.flush();

        // when
        List<User> found = userRepository.searchByName(searchTerm);

        // then
        assertThat(found).hasSize(expectedNames.length);
        assertThat(found.stream().map(User::getFullName))
                .containsExactlyInAnyOrder(expectedNames);
    }

    private static Stream<Arguments> provideSearchTerms() {
        return Stream.of(
            Arguments.of("Doe", new String[]{"John Doe", "Jane Doe"}),
            Arguments.of("John", new String[]{"John Doe"}),
            Arguments.of("Smith", new String[]{"Bob Smith"})
        );
    }

    private User createUser(String fullName, String email) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword("password");
        return user;
    }
}