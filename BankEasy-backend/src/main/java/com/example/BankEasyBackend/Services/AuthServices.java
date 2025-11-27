package com.example.BankEasyBackend.Services;

import com.example.BankEasyBackend.Repository.*;
import com.example.BankEasyBackend.Model.*;
import org.springframework.stereotype.Service;

@Service
public class AuthServices {

    private final UserRepository userRepository;

    public AuthServices(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
