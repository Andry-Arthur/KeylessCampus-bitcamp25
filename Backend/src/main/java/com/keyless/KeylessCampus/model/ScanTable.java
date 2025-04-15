package com.keyless.KeylessCampus.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "scantable")
public class ScanTable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne()
    @JoinColumn(name = "door_id")
    private DoorSystem doorSystem;
    @CreationTimestamp
    private Timestamp timestamp;

    private Boolean isDenied;

    // Default constructor
    public ScanTable() {
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DoorSystem getDoorSystem() {
        return doorSystem;
    }

    public void setDoorSystem(DoorSystem doorSystem) {
        this.doorSystem = doorSystem;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getIsDenied() {
        return isDenied;
    }

    public void setIsDenied(Boolean isDenied) {
        this.isDenied = isDenied;
    }
}
