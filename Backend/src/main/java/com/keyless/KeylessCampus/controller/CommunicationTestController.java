package com.keyless.KeylessCampus.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CommunicationTestController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}