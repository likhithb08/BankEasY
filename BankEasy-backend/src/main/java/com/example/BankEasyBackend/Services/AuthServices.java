package com.example.BankEasyBackend.Services;

import com.example.BankEasyBackend.Repository.*;
import com.example.BankEasyBackend.Model.*;
import org.springframework.stereotype.Service;
import com.example.BankEasyBackend.Utils.JwtUtil;

@Service
public class AuthServices {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthServices(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public String register(User user) {
        if (userRepository.existsById(user.getUsername())) {
            return "User already exists";
        }

        user.setDateCreated(java.time.LocalDate.now());
        userRepository.save(user);
        return "User registered successfully";
    }

    public User login(String username, String password) {
        return userRepository.findById(username).filter(u -> u.getPassword().equals(password)).orElse(null);

    }

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getUsername());
    }

    public User validateTokenAndGetUser(String token) {
        if (!jwtUtil.validateToken(token)) {
            return null;
        }
        String username = jwtUtil.extractUsername(token);
        return userRepository.findById(username).orElse(null);
    }

    public void deleteUser(String username) {
        userRepository.deleteById(username);
    }
}
