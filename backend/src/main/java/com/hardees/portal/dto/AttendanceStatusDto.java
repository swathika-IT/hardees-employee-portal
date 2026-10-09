package com.hardees.portal.dto;

import java.time.LocalDateTime;

public class AttendanceStatusDto {
    private String status; // "NOT_CHECKED_IN", "ON_SHIFT", "SHIFT_COMPLETED"
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private double hoursToday;
    private Long activeRecordId;
    private Long liveMinutes;

    public AttendanceStatusDto() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public double getHoursToday() { return hoursToday; }
    public void setHoursToday(double hoursToday) { this.hoursToday = hoursToday; }

    public Long getActiveRecordId() { return activeRecordId; }
    public void setActiveRecordId(Long activeRecordId) { this.activeRecordId = activeRecordId; }

    public Long getLiveMinutes() { return liveMinutes; }
    public void setLiveMinutes(Long liveMinutes) { this.liveMinutes = liveMinutes; }
}
