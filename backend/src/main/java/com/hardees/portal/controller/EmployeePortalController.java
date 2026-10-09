package com.hardees.portal.controller;

import com.hardees.portal.dto.AttendanceStatusDto;
import com.hardees.portal.entity.AttendanceRecord;
import com.hardees.portal.entity.Employee;
import com.hardees.portal.entity.UserAccount;
import com.hardees.portal.service.AttendanceService;
import com.hardees.portal.service.AuthService;
import com.hardees.portal.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EmployeePortalController {

    private final AuthService authService;
    private final AttendanceService attendanceService;
    private final EmployeeService employeeService;

    public EmployeePortalController(AuthService authService,
                                    AttendanceService attendanceService,
                                    EmployeeService employeeService) {
        this.authService = authService;
        this.attendanceService = attendanceService;
        this.employeeService = employeeService;
    }

    @GetMapping("/me/profile")
    public ResponseEntity<Employee> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        UserAccount user = authService.validateToken(authHeader);
        Employee emp = employeeService.getByCode(user.getEmployeeId());
        return ResponseEntity.ok(emp);
    }

    @GetMapping("/me/status")
    public ResponseEntity<AttendanceStatusDto> getStatus(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        UserAccount user = authService.validateToken(authHeader);
        AttendanceStatusDto status = attendanceService.getEmployeeStatus(user.getEmployeeId());
        return ResponseEntity.ok(status);
    }

    @GetMapping("/me/attendance")
    public ResponseEntity<List<AttendanceRecord>> getAttendanceHistory(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        UserAccount user = authService.validateToken(authHeader);
        List<AttendanceRecord> records = attendanceService.getEmployeeAttendanceHistory(user.getEmployeeId());
        return ResponseEntity.ok(records);
    }

    @PostMapping("/attendance/check-in")
    public ResponseEntity<AttendanceRecord> checkIn(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody(required = false) Map<String, String> body) {
        UserAccount user = authService.validateToken(authHeader);
        String targetCode = user.getEmployeeId();
        // If manager is checking in on behalf of someone else
        if (body != null && body.containsKey("employeeCode") && ("STORE_MANAGER".equals(user.getRole()) || "ADMIN".equals(user.getRole()))) {
            targetCode = body.get("employeeCode");
        }
        String notes = (body != null) ? body.get("notes") : null;
        AttendanceRecord record = attendanceService.checkIn(targetCode, notes);
        return ResponseEntity.ok(record);
    }

    @PostMapping("/attendance/check-out")
    public ResponseEntity<AttendanceRecord> checkOut(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody(required = false) Map<String, String> body) {
        UserAccount user = authService.validateToken(authHeader);
        String targetCode = user.getEmployeeId();
        // If manager is checking out on behalf of someone else
        if (body != null && body.containsKey("employeeCode") && ("STORE_MANAGER".equals(user.getRole()) || "ADMIN".equals(user.getRole()))) {
            targetCode = body.get("employeeCode");
        }
        String notes = (body != null) ? body.get("notes") : null;
        AttendanceRecord record = attendanceService.checkOut(targetCode, notes);
        return ResponseEntity.ok(record);
    }
}
