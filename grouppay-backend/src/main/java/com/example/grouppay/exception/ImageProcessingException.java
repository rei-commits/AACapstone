package com.example.grouppay.exception;

public class ImageProcessingException extends RuntimeException {
    private final String errorCode;

    public ImageProcessingException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public ImageProcessingException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public static class ErrorCodes {
        public static final String FILE_TOO_LARGE = "IMG_001";
        public static final String INVALID_FILE_TYPE = "IMG_002";
        public static final String CORRUPTED_IMAGE = "IMG_003";
        public static final String EMPTY_FILE = "IMG_004";
        public static final String PROCESSING_ERROR = "IMG_005";
    }
} 