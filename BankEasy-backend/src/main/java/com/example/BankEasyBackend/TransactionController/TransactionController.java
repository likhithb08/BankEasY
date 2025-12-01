package com.example.BankEasyBackend.TransactionController;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BankEasyBackend.Services.TransactionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.BankEasyBackend.Model.*;
import com.example.BankEasyBackend.DTO.TransactionRequest;

@RestController
@RequestMapping("api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping("/deposit")
    public String deposit(@RequestBody TransactionRequest request) {
        return service.deposit(
                request.getUsername(),
                request.getAmount(),
                request.getNote());
    }

    @PostMapping("/withdraw")
    public String withdraw(@RequestBody TransactionRequest request) {
        return service.withdraw(
                request.getUsername(),
                request.getAmount(),
                request.getNote());
    }

    @GetMapping("/history/{username}")
    public List<Transaction> history(@PathVariable String username) {
        return service.getHistory(username);
    }

    @GetMapping("/balance/{username}")
    public Double balance(@PathVariable String username) {
        return service.getBalance(username);
    }

}
