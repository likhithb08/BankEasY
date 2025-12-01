package com.example.BankEasyBackend.DTO;

public class TransactionRequest {
    private String username;
    private Double amount;
    private String note;

    public TransactionRequest() {
    }

    public TransactionRequest(String username, Double amount, String note) {
        this.username = username;
        this.amount = amount;
        this.note = note;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
