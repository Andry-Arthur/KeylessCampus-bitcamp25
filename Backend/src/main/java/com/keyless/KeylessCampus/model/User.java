package com.keyless.KeylessCampus.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String username;
    private String password;
    private String RFID;

}
