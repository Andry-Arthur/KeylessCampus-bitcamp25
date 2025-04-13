package com.keyless.KeylessCampus.controller;

public class SignupRequest {
    private String username;
    private String password;
    private String rfid;
    private String serialID;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "SignupRequest{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", rfid='" + rfid + '\'' +
                ", serialID='" + serialID + '\'' +
                '}';
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRfid(String rfid) {
        this.rfid = rfid;
    }

    public void setSerialID(String serialID) {
        this.serialID = serialID;
    }

    public SignupRequest(String username, String password, String rfid, String serialID) {
        this.username = username;
        this.password = password;
        this.rfid = rfid;
        this.serialID = serialID;
    }

    public String getPassword() {
        return password;
    }

    public String getRfid() {
        return rfid;
    }

    public String getSerialID() {
        return serialID;
    }
}
