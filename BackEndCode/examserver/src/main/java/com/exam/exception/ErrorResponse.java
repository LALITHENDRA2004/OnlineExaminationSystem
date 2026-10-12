package com.exam.exception;

import java.util.Date;

public class ErrorResponse {
    private String message;
    private int status;
    private Date timestamp;

    public ErrorResponse() {
        this.timestamp = new Date();
    }

    public ErrorResponse(String message) {
        this.message = message;
        this.timestamp = new Date();
    }

    public ErrorResponse(String message, int status) {
        this.message = message;
        this.status = status;
        this.timestamp = new Date();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
