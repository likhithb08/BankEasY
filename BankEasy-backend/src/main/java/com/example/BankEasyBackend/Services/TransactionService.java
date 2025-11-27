package com.example.BankEasyBackend.Services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BankEasyBackend.Model.Transaction;
import com.example.BankEasyBackend.Model.User;
import com.example.BankEasyBackend.Repository.TransactionRepository;
import com.example.BankEasyBackend.Repository.UserRepository;

@Service
public class TransactionService {
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(UserRepository userRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // Deposit Logic
    public String deposit(String username, Double amount, String note) {
        User user = userRepository.findById(username).orElse(null);
        if (user == null)
            return "User Not Found";

        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);

        Transaction tx = new Transaction(username, amount, "DEPOSIT", note, LocalDate.now());
        transactionRepository.save(tx);

        return "Deposit Successfull";
    }

    // Withdraw Logic
    public String withdraw(String username, Double amount, String note) {
        User user = userRepository.findById(username).orElse(null);
        if (user == null)
            return "User Not Found";

        if (user.getBalance() < amount)
            return "Insufficient Balance";

        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);

        Transaction tx = new Transaction(username, amount, "WITHDRAW", note, LocalDate.now());
        transactionRepository.save(tx);

        return "Withdraw Successfull";
    }

    public List<Transaction> getHistory(String username) {
        return transactionRepository.findByUsernameOrderByDateDesc(username);
    }

    public Double getBalance(String username) {
        return userRepository.findById(username).map(User::getBalance).orElse(0.0);
    }
}
