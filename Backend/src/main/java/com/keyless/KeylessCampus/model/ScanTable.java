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
<<<<<<< HEAD

    private Boolean isDenied;
=======
>>>>>>> master
}
