package com.keyless.KeylessCampus.model;

import jakarta.persistence.*;



@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String RFID;

    public User(String username, String password, String RFID) {
        this.username = username;
        this.password = password;
        this.RFID = RFID;
    }

    public User() {

    }

    public void setId(Long id) {
        this.id = id;
    }


    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRFID(String RFID) {
        this.RFID = RFID;
    }

    public Long getId() {
        return id;
    }


    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRFID() {
        return RFID;
    }
}
