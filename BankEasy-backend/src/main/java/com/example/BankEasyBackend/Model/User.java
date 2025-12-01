package com.example.BankEasyBackend.Model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String username;

    private String name;
    private String email;
    private String password;
    private String accountType;
    private String phone;
    @Column(nullable = false)
    private Double balance;

    private LocalDate dateCreated;

    public User() {

    }

    public User(String username, String name, String email, String password, String accountType, String phone,
            LocalDate dateCreated, Double balance) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.accountType = accountType;
        this.phone = phone;
        this.dateCreated = dateCreated;
        this.balance = (balance != null) ? balance : 0.0;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDate dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

}
