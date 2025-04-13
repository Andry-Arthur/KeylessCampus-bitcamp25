package com.keyless.KeylessCampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class KeylessCampusApplication {
	public static void main(String[] args) {
		SpringApplication.run(KeylessCampusApplication.class, args);
	}
}
