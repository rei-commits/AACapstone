package com.example.grouppay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GroupPayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GroupPayApplication.class, args);
    }
}