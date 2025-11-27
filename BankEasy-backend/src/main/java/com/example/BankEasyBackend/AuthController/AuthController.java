package com.example.BankEasyBackend.AuthController;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BankEasyBackend.Model.User;
import com.example.BankEasyBackend.Services.AuthServices;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthServices authServices;

    public AuthController(AuthServices authServices) {
        this.authServices = authServices;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authServices.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User req) {
        return authServices.login(req.getUsername(), req.getPassword());
    }

}
