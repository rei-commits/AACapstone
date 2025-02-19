package tally.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tally.example.demo.exception.ApiException;
import tally.example.demo.model.User;
import tally.example.demo.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User createUser(String email, String name) {
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setActive(true);
        return userRepository.save(user);
    }

    public User getOrCreateUser(Long userId) {
        return userRepository.findById(userId)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setId(userId);
                newUser.setName("User " + userId);
                newUser.setActive(true);
                return userRepository.save(newUser);
            });
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public User updateUser(Long userId, String email, String name, String photoUrl) {
        User user = getCurrentUser(userId);
        user.setEmail(email);
        user.setName(name);
        user.setPhotoUrl(photoUrl);
        return userRepository.save(user);
    }

    @Transactional
    public void addFriend(Long userId, Long friendId) {
        User user = getCurrentUser(userId);
        User friend = getCurrentUser(friendId);
        user.getFriends().add(friend);
        userRepository.save(user);
    }

    public List<User> getFriends(Long userId) {
        User user = getCurrentUser(userId);
        return new ArrayList<>(user.getFriends());
    }

    @Transactional
    public void deactivateAccount(Long userId) {
        User user = getCurrentUser(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void reactivateAccount(Long userId) {
        User user = getCurrentUser(userId);
        user.setActive(true);
        userRepository.save(user);
    }
} 