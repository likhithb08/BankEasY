package com.example.BankEasyBackend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.BankEasyBackend.Model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUsernameOrderByDateDesc(String username);
}
