package tally.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tally.example.demo.exception.ApiException;
import tally.example.demo.model.User;
import tally.example.demo.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User createUser(String uid, String email, String name, String photoUrl) {
        User user = new User();
        user.setUid(uid);
        user.setEmail(email);
        user.setName(name);
        user.setPhotoUrl(photoUrl);
        return userRepository.save(user);
    }

    public User getCurrentUser(String uid) {
        return userRepository.findById(uid)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User getUserById(String uid) {
        return userRepository.findById(uid)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public User updateUser(String uid, String email, String name, String photoUrl) {
        User user = getCurrentUser(uid);
        user.setEmail(email);
        user.setName(name);
        user.setPhotoUrl(photoUrl);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String uid) {
        User user = getCurrentUser(uid);
        userRepository.delete(user);
    }

    public boolean existsByUid(String uid) {
        return userRepository.existsById(uid);
    }

    public List<User> getFriends(User user) {
        // Implement your friend logic here
        return userRepository.findAll(); // For now, return all users
    }
} 