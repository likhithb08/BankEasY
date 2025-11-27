package com.example.BankEasyBackend.TransactionController;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BankEasyBackend.Services.TransactionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.BankEasyBackend.Model.*;

@RestController
@RequestMapping("api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping("/deposit")
    public String deposit(@RequestBody Map<String, Object> body) {
        return service.deposit(
                (String) body.get("username"),
                Double.parseDouble(body.get("amount").toString()),
                (String) body.get("note"));
    }

    @PostMapping("/withdraw")
    public String withdraw(@RequestBody Map<String, Object> body) {
        return service.withdraw(
                (String) body.get("username"),
                Double.parseDouble(body.get("amount").toString()),
                (String) body.get("note"));
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
