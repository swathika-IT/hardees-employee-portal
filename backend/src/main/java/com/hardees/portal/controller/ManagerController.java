package com.hardees.portal.controller;

import com.hardees.portal.dto.ManagerStatsDto;
import com.hardees.portal.entity.AttendanceRecord;
import com.hardees.portal.entity.Employee;
import com.hardees.portal.entity.UserAccount;
import com.hardees.portal.service.AttendanceService;
import com.hardees.portal.service.AuthService;
import com.hardees.portal.service.EmployeeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final AuthService authService;
    private final EmployeeService employeeService;
    private final AttendanceService attendanceService;

    public ManagerController(AuthService authService,
                             EmployeeService employeeService,
                             AttendanceService attendanceService) {
        this.authService = authService;
        this.employeeService = employeeService;
        this.attendanceService = attendanceService;
    }

    private UserAccount requireManager(String authHeader) {
        UserAccount user = authService.validateToken(authHeader);
        if (!"STORE_MANAGER".equalsIgnoreCase(user.getRole()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Store Manager or Admin access required");
        }
        return user;
    }

    @GetMapping("/stats")
    public ResponseEntity<ManagerStatsDto> getStats(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        requireManager(authHeader);
        ManagerStatsDto stats = attendanceService.getManagerStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getEmployees(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String dept,
            @RequestParam(required = false) String status) {
        requireManager(authHeader);
        List<Employee> list = employeeService.search(q, dept, status);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployee(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        requireManager(authHeader);
        return ResponseEntity.ok(employeeService.getById(id));
    }

    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Employee employee,
            @RequestParam(required = false) String defaultPassword) {
        requireManager(authHeader);
        Employee created = employeeService.create(employee, defaultPassword);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id,
            @RequestBody Employee employee) {
        requireManager(authHeader);
        Employee updated = employeeService.update(id, employee);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/employees/{id}/status")
    public ResponseEntity<Employee> toggleEmployeeStatus(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        requireManager(authHeader);
        String status = body.getOrDefault("status", "Active");
        Employee updated = employeeService.toggleStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        requireManager(authHeader);
        employeeService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Employee removed successfully"));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceRecord>> getAttendance(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        requireManager(authHeader);
        List<AttendanceRecord> records = attendanceService.filterAttendance(employeeId, startDate, endDate);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/attendance/export-csv")
    public ResponseEntity<byte[]> exportAttendanceCsv(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        requireManager(authHeader);
        List<AttendanceRecord> records = attendanceService.filterAttendance(employeeId, startDate, endDate);
        String csv = attendanceService.generateAttendanceCsv(records);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "hardees_attendance_report.csv");
        return new ResponseEntity<>(csv.getBytes(), headers, HttpStatus.OK);
    }

    @GetMapping("/employees/export-csv")
    public ResponseEntity<byte[]> exportEmployeesCsv(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String dept,
            @RequestParam(required = false) String status) {
        requireManager(authHeader);
        List<Employee> list = employeeService.search(q, dept, status);
        String csv = employeeService.generateEmployeesCsv(list);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "hardees_employee_directory.csv");
        return new ResponseEntity<>(csv.getBytes(), headers, HttpStatus.OK);
    }
}
