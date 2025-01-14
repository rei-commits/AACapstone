package com.example.grouppay.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.example.grouppay.dto.ErrorResponse;
import com.example.grouppay.exception.ImageProcessingException.ErrorCodes;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ImageProcessingException.class)
    public ResponseEntity<ErrorResponse> handleImageProcessingException(
            ImageProcessingException ex, 
            WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
            .errorCode(ex.getErrorCode())
            .message(ex.getMessage())
            .details(ex.getCause() != null ? ex.getCause().getMessage() : null)
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false))
            .build();

        HttpStatus status = switch (ex.getErrorCode()) {
            case ErrorCodes.FILE_TOO_LARGE -> HttpStatus.PAYLOAD_TOO_LARGE;
            case ErrorCodes.INVALID_FILE_TYPE -> HttpStatus.UNSUPPORTED_MEDIA_TYPE;
            case ErrorCodes.EMPTY_FILE, ErrorCodes.CORRUPTED_IMAGE -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return new ResponseEntity<>(error, status);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, 
            WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
            .errorCode("NOT_FOUND")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false))
            .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, 
            WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
            .errorCode("INTERNAL_ERROR")
            .message("An unexpected error occurred")
            .details(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false))
            .build();

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}