package com.hardees.portal.service;

import com.hardees.portal.entity.Employee;
import com.hardees.portal.entity.UserAccount;
import com.hardees.portal.repository.EmployeeRepository;
import com.hardees.portal.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserAccountRepository userAccountRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository,
                           UserAccountRepository userAccountRepository,
                           AuthService authService) {
        this.employeeRepository = employeeRepository;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = authService.getPasswordEncoder();
    }

    public List<Employee> search(String query, String dept, String status) {
        return employeeRepository.searchEmployees(query, dept, status);
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: " + id));
    }

    public Employee getByCode(String code) {
        return employeeRepository.findByEmployeeCodeIgnoreCase(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: " + code));
    }

    @Transactional
    public Employee create(Employee e, String defaultPassword) {
        if (e.getEmployeeCode() == null || e.getEmployeeCode().isBlank() ||
            e.getFullName() == null || e.getFullName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee code and full name are required");
        }

        String cleanCode = e.getEmployeeCode().trim().toUpperCase();
        if (employeeRepository.existsByEmployeeCodeIgnoreCase(cleanCode)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Employee code already exists: " + cleanCode);
        }

        e.setId(null);
        e.setEmployeeCode(cleanCode);
        if (e.getAccountStatus() == null) e.setAccountStatus("Active");
        if (e.getJoiningDate() == null) e.setJoiningDate(LocalDate.now());
        if (e.getRestaurantLocation() == null) e.setRestaurantLocation("481 US Highway 1 S, Rockingham, NC");

        Employee saved = employeeRepository.save(e);

        // Also create UserAccount
        String pwd = (defaultPassword != null && !defaultPassword.isBlank()) ? defaultPassword : "Hardees@" + cleanCode;
        String role = "Store Management".equalsIgnoreCase(e.getDepartment()) || "General Manager".equalsIgnoreCase(e.getJobRole()) ? "STORE_MANAGER" : "EMPLOYEE";
        UserAccount account = new UserAccount(cleanCode, passwordEncoder.encode(pwd), role, e.getFullName());
        userAccountRepository.save(account);

        return saved;
    }

    @Transactional
    public Employee update(Long id, Employee updated) {
        Employee e = getById(id);

        if (updated.getFullName() != null && !updated.getFullName().isBlank()) {
            e.setFullName(updated.getFullName());
        }
        if (updated.getJobRole() != null) e.setJobRole(updated.getJobRole());
        if (updated.getDepartment() != null) e.setDepartment(updated.getDepartment());
        if (updated.getEmail() != null) e.setEmail(updated.getEmail());
        if (updated.getPhone() != null) e.setPhone(updated.getPhone());
        if (updated.getRestaurantLocation() != null) e.setRestaurantLocation(updated.getRestaurantLocation());
        if (updated.getEmploymentStatus() != null) e.setEmploymentStatus(updated.getEmploymentStatus());
        if (updated.getHourlyRate() != null) e.setHourlyRate(updated.getHourlyRate());
        if (updated.getAccountStatus() != null) {
            e.setAccountStatus(updated.getAccountStatus());
            // Sync user account active status
            userAccountRepository.findByEmployeeIdIgnoreCase(e.getEmployeeCode()).ifPresent(u -> {
                u.setActive("Active".equalsIgnoreCase(updated.getAccountStatus()));
                userAccountRepository.save(u);
            });
        }

        // Sync full name with user account
        userAccountRepository.findByEmployeeIdIgnoreCase(e.getEmployeeCode()).ifPresent(u -> {
            u.setFullName(e.getFullName());
            userAccountRepository.save(u);
        });

        return employeeRepository.save(e);
    }

    @Transactional
    public Employee toggleStatus(Long id, String newStatus) {
        Employee e = getById(id);
        e.setAccountStatus(newStatus);
        userAccountRepository.findByEmployeeIdIgnoreCase(e.getEmployeeCode()).ifPresent(u -> {
            u.setActive("Active".equalsIgnoreCase(newStatus));
            userAccountRepository.save(u);
        });
        return employeeRepository.save(e);
    }

    @Transactional
    public void delete(Long id) {
        Employee e = getById(id);
        userAccountRepository.findByEmployeeIdIgnoreCase(e.getEmployeeCode()).ifPresent(userAccountRepository::delete);
        employeeRepository.delete(e);
    }

    public String generateEmployeesCsv(List<Employee> employees) {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Employee Code,Full Name,Role,Department,Location,Status,Hourly Rate,Email,Phone,Joining Date\n");
        for (Employee e : employees) {
            sb.append(e.getId()).append(",");
            sb.append("\"").append(e.getEmployeeCode()).append("\",");
            sb.append("\"").append(e.getFullName().replace("\"", "\"\"")).append("\",");
            sb.append("\"").append(e.getJobRole() != null ? e.getJobRole().replace("\"", "\"\"") : "").append("\",");
            sb.append("\"").append(e.getDepartment() != null ? e.getDepartment().replace("\"", "\"\"") : "").append("\",");
            sb.append("\"").append(e.getRestaurantLocation() != null ? e.getRestaurantLocation().replace("\"", "\"\"") : "").append("\",");
            sb.append(e.getAccountStatus()).append(",");
            sb.append(e.getHourlyRate() != null ? e.getHourlyRate() : 0.0).append(",");
            sb.append("\"").append(e.getEmail() != null ? e.getEmail().replace("\"", "\"\"") : "").append("\",");
            sb.append("\"").append(e.getPhone() != null ? e.getPhone().replace("\"", "\"\"") : "").append("\",");
            sb.append(e.getJoiningDate() != null ? e.getJoiningDate().toString() : "").append("\n");
        }
        return sb.toString();
    }
}
