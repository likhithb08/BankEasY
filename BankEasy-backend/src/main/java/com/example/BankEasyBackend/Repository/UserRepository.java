package com.example.BankEasyBackend.Repository;

import com.example.BankEasyBackend.Model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

}
