package com.example.grouppay.service;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.grouppay.exception.ResourceNotFoundException;
import com.example.grouppay.model.User;
import com.example.grouppay.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void whenCreateUser_thenReturnSavedUser() {
        // given
        User user = new User();
        user.setFullName("John Doe");
        user.setEmail("john@example.com");
        
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        User created = userService.createUser(user);

        // then
        assertThat(created.getFullName()).isEqualTo(user.getFullName());
        assertThat(created.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    public void whenGetUserByEmail_thenReturnUser() {
        // given
        String email = "john@example.com";
        User user = new User();
        user.setEmail(email);
        
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // when
        User found = userService.getUserByEmail(email);

        // then
        assertThat(found.getEmail()).isEqualTo(email);
    }

    @Test
    public void whenGetUserByEmail_withNonExistingEmail_thenThrowException() {
        // given
        String email = "nonexisting@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // when/then
        assertThatThrownBy(() -> userService.getUserByEmail(email))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found with email: " + email);
    }
} 