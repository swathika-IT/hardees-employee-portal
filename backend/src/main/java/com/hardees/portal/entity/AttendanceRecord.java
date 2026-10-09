package com.hardees.portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records", indexes = {
    @Index(name = "idx_att_emp", columnList = "employee_id"),
    @Index(name = "idx_att_date", columnList = "attendance_date"),
    @Index(name = "idx_att_checkout", columnList = "check_out")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"attendanceRecords"})
    private Employee employee;

    @Column(name = "check_in", nullable = false)
    private LocalDateTime checkIn;

    @Column(name = "check_out")
    private LocalDateTime checkOut;

    @Column(name = "shift_duration_minutes")
    private Long shiftDurationMinutes;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(length = 255)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AttendanceRecord() {}

    public AttendanceRecord(Employee employee, LocalDateTime checkIn) {
        this.employee = employee;
        this.checkIn = checkIn;
        this.attendanceDate = checkIn.toLocalDate();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.checkIn != null && this.checkOut != null) {
            this.shiftDurationMinutes = Duration.between(this.checkIn, this.checkOut).toMinutes();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDateTime getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDateTime checkIn) {
        this.checkIn = checkIn;
        if (checkIn != null) {
            this.attendanceDate = checkIn.toLocalDate();
        }
    }

    public LocalDateTime getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDateTime checkOut) {
        this.checkOut = checkOut;
        if (this.checkIn != null && checkOut != null) {
            this.shiftDurationMinutes = Duration.between(this.checkIn, checkOut).toMinutes();
        }
    }

    public Long getShiftDurationMinutes() { return shiftDurationMinutes; }
    public void setShiftDurationMinutes(Long shiftDurationMinutes) { this.shiftDurationMinutes = shiftDurationMinutes; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Double getShiftHours() {
        if (shiftDurationMinutes == null) {
            if (checkIn != null && checkOut == null) {
                return (double) Math.round((Duration.between(checkIn, LocalDateTime.now()).toMinutes() / 60.0) * 10) / 10;
            }
            return 0.0;
        }
        return (double) Math.round((shiftDurationMinutes / 60.0) * 10) / 10;
    }

    public String getStatus() {
        if (checkOut == null) {
            return "ON_SHIFT";
        }
        return "COMPLETED";
    }
}
