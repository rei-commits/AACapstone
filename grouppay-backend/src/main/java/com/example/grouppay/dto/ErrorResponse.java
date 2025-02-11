package com.example.grouppay.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ErrorResponse {
    private String errorCode;
    private String message;
    private String details;
    private LocalDateTime timestamp;
    private String path;
} 