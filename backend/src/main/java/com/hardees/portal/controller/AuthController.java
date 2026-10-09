package com.hardees.portal.controller;

import com.hardees.portal.dto.LoginRequest;
import com.hardees.portal.dto.LoginResponse;
import com.hardees.portal.entity.Employee;
import com.hardees.portal.entity.UserAccount;
import com.hardees.portal.repository.EmployeeRepository;
import com.hardees.portal.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final EmployeeRepository employeeRepository;

    public AuthController(AuthService authService, EmployeeRepository employeeRepository) {
        this.authService = authService;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        UserAccount user = authService.validateToken(authHeader);
        Optional<Employee> empOpt = employeeRepository.findByEmployeeCodeIgnoreCase(user.getEmployeeId());

        return ResponseEntity.ok(Map.of(
                "employeeId", user.getEmployeeId(),
                "fullName", user.getFullName(),
                "role", user.getRole(),
                "active", user.isActive(),
                "employee", empOpt.orElse(null)
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
