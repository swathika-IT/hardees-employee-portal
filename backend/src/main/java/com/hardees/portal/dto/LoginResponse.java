package com.hardees.portal.dto;

public class LoginResponse {
    private String token;
    private String employeeId;
    private String fullName;
    private String role; // "STORE_MANAGER", "ADMIN", "EMPLOYEE"
    private Long employeeTableId;
    private String department;
    private String jobRole;
    private String email;
    private String restaurantLocation;

    public LoginResponse() {}

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getEmployeeTableId() { return employeeTableId; }
    public void setEmployeeTableId(Long employeeTableId) { this.employeeTableId = employeeTableId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRestaurantLocation() { return restaurantLocation; }
    public void setRestaurantLocation(String restaurantLocation) { this.restaurantLocation = restaurantLocation; }
}
