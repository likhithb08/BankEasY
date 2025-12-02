package com.example.BankEasyBackend.AuthController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BankEasyBackend.Model.User;
import com.example.BankEasyBackend.Services.AuthServices;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = { "http://127.0.0.1:5500", "http://localhost:5500" }, allowCredentials = "true")
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
    public ResponseEntity<?> login(@RequestBody User req, HttpServletResponse response) {
        User user = authServices.login(req.getUsername(), req.getPassword());

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }

        String token = authServices.generateToken(user);

        Cookie cookie = new Cookie("auth_token", token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setMaxAge(24 * 60 * 60);

        response.addCookie(cookie);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedUser(@CookieValue(value = "auth_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = authServices.validateTokenAndGetUser(token);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse res) {
        Cookie cookie = new Cookie("auth_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        res.addCookie(cookie);
        return ResponseEntity.ok("Logged Out Successfully");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(@CookieValue(value = "auth_token", required = false) String token,
            HttpServletResponse res) {
        User user = authServices.validateTokenAndGetUser(token);

        authServices.deleteUser(user.getUsername());
        Cookie cookie = new Cookie("auth_token", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        res.addCookie(cookie);

        return ResponseEntity.ok("Account Deleted");
    }
}
