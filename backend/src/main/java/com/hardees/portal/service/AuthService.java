package com.hardees.portal.service;

import com.hardees.portal.dto.LoginRequest;
import com.hardees.portal.dto.LoginResponse;
import com.hardees.portal.entity.Employee;
import com.hardees.portal.entity.UserAccount;
import com.hardees.portal.repository.EmployeeRepository;
import com.hardees.portal.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserAccountRepository userAccountRepository, EmployeeRepository employeeRepository) {
        this.userAccountRepository = userAccountRepository;
        this.employeeRepository = employeeRepository;
    }

    public BCryptPasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        if (request.getEmployeeId() == null || request.getEmployeeId().isBlank() ||
            request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee ID and password are required");
        }

        UserAccount user = userAccountRepository.findByEmployeeIdIgnoreCase(request.getEmployeeId().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid employee credentials"));

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is deactivated. Please contact store management.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid employee credentials");
        }

        // Generate session token
        String token = "hrd_" + UUID.randomUUID().toString().replace("-", "");
        user.setSessionToken(token);
        userAccountRepository.save(user);

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setEmployeeId(user.getEmployeeId());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());

        // Find associated employee profile
        Optional<Employee> empOpt = employeeRepository.findByEmployeeCodeIgnoreCase(user.getEmployeeId());
        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            response.setEmployeeTableId(emp.getId());
            response.setDepartment(emp.getDepartment());
            response.setJobRole(emp.getJobRole());
            response.setEmail(emp.getEmail());
            response.setRestaurantLocation(emp.getRestaurantLocation());
        }

        return response;
    }

    public UserAccount validateToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid authorization header");
        }
        String token = authHeader.substring(7).trim();
        return userAccountRepository.findBySessionToken(token)
                .filter(UserAccount::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired or invalid"));
    }

    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            userAccountRepository.findBySessionToken(token).ifPresent(user -> {
                user.setSessionToken(null);
                userAccountRepository.save(user);
            });
        }
    }
}
