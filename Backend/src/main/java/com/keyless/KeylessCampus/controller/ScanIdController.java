package com.keyless.KeylessCampus.controller;

import com.keyless.KeylessCampus.tcp.DualPortTCP;
import com.keyless.KeylessCampus.tcp.TCPStarter;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.net.ServerSocket;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
public class ScanIdController {

    private final ServerSocket serverSocket;

    public ScanIdController(TCPStarter tcpStarter) {
        this.serverSocket = tcpStarter.getServerSocket();
    }

    @CrossOrigin(origins = "*")
    @Async
    @GetMapping("/scanid")
    public CompletableFuture<ResponseEntity<Map<String, String>>> getScanIdMessage() {
        return DualPortTCP.getMessageFromPortAsync(serverSocket)
                .thenApply(message -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("RFID", message != null ? message : "No message received or an error occurred.");
                    return ResponseEntity.ok(response);
                });
    }
}