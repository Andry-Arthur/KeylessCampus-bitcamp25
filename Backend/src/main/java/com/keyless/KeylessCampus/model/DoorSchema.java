package com.keyless.KeylessCampus.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "DoorSchema")
public class DoorSchema {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private UUID doorId;
    private String rfid;

}
