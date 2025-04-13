package com.keyless.KeylessCampus.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "DoorSchema")
public class DoorSchema {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String serialId;
    private String rfid;

    public DoorSchema(){

    }

    public DoorSchema(String serialId, String rfid) {
        this.serialId = serialId;
        this.rfid = rfid;
    }

    public String getSerialId() {
        return serialId;
    }

    public void setSerialId(String serialId) {
        this.serialId = serialId;
    }

    public String getRfid() {
        return rfid;
    }

    public void setRfid(String rfid) {
        this.rfid = rfid;
    }
}
