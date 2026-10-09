package com.hardees.portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_emp_code", columnList = "employee_code", unique = true),
    @Index(name = "idx_emp_status", columnList = "account_status"),
    @Index(name = "idx_emp_dept", columnList = "department")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", nullable = false, unique = true, length = 64)
    private String employeeCode;

    @Column(name = "full_name", nullable = false, length = 128)
    private String fullName;

    @Column(length = 128)
    private String email;

    @Column(length = 32)
    private String phone;

    @Column(name = "job_role", length = 64)
    private String jobRole; // e.g. Crew Member, Shift Leader, Kitchen Lead, General Manager

    @Column(length = 64)
    private String department; // Kitchen Operations, Front Counter, Store Management, Drive-Thru

    @Column(name = "restaurant_location", length = 255)
    private String restaurantLocation = "481 US Highway 1 S, Rockingham, NC";

    @Column(name = "employment_status", length = 32)
    private String employmentStatus = "Full-Time";

    @Column(name = "joining_date")
    private LocalDate joiningDate = LocalDate.now();

    @Column(name = "hourly_rate")
    private Double hourlyRate = 14.50;

    @Column(name = "account_status", nullable = false, length = 32)
    private String accountStatus = "Active"; // Active, Inactive, On Leave

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("checkIn DESC")
    @JsonIgnoreProperties("employee")
    private List<AttendanceRecord> attendanceRecords = new ArrayList<>();

    public Employee() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRestaurantLocation() { return restaurantLocation; }
    public void setRestaurantLocation(String restaurantLocation) { this.restaurantLocation = restaurantLocation; }

    public String getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(String employmentStatus) { this.employmentStatus = employmentStatus; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<AttendanceRecord> getAttendanceRecords() { return attendanceRecords; }
    public void setAttendanceRecords(List<AttendanceRecord> attendanceRecords) { this.attendanceRecords = attendanceRecords; }
}
