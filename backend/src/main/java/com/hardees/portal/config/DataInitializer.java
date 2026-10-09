package com.hardees.portal.config;

import com.hardees.portal.entity.AttendanceRecord;
import com.hardees.portal.entity.Employee;
import com.hardees.portal.entity.UserAccount;
import com.hardees.portal.repository.AttendanceRepository;
import com.hardees.portal.repository.EmployeeRepository;
import com.hardees.portal.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final UserAccountRepository userAccountRepository;
    private final AttendanceRepository attendanceRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(EmployeeRepository employeeRepository,
                           UserAccountRepository userAccountRepository,
                           AttendanceRepository attendanceRepository) {
        this.employeeRepository = employeeRepository;
        this.userAccountRepository = userAccountRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Store Manager
        Employee mgr = new Employee();
        mgr.setEmployeeCode("MGR001");
        mgr.setFullName("Sarah Jenkins");
        mgr.setEmail("sarah.jenkins@hardees-rockingham.com");
        mgr.setPhone("(910) 895-1020");
        mgr.setJobRole("General Manager");
        mgr.setDepartment("Store Management");
        mgr.setRestaurantLocation("481 US Highway 1 S, Rockingham, NC");
        mgr.setEmploymentStatus("Full-Time");
        mgr.setJoiningDate(LocalDate.of(2023, 3, 15));
        mgr.setHourlyRate(24.50);
        mgr.setAccountStatus("Active");
        employeeRepository.save(mgr);

        UserAccount mgrAccount = new UserAccount("MGR001", passwordEncoder.encode("Admin@123"), "STORE_MANAGER", "Sarah Jenkins");
        userAccountRepository.save(mgrAccount);

        // 2. Demo Employee (Jordan Miller from original project)
        Employee demo = new Employee();
        demo.setEmployeeCode("DEMO1001");
        demo.setFullName("Jordan Miller");
        demo.setEmail("jordan.miller@hardees-rockingham.com");
        demo.setPhone("(910) 895-1044");
        demo.setJobRole("Crew Member");
        demo.setDepartment("Kitchen Operations");
        demo.setRestaurantLocation("481 US Highway 1 S, Rockingham, NC");
        demo.setEmploymentStatus("Full-Time");
        demo.setJoiningDate(LocalDate.of(2024, 6, 1));
        demo.setHourlyRate(14.50);
        demo.setAccountStatus("Active");
        employeeRepository.save(demo);

        UserAccount demoAccount = new UserAccount("DEMO1001", passwordEncoder.encode("Demo@123"), "EMPLOYEE", "Jordan Miller");
        userAccountRepository.save(demoAccount);

        // 3. Additional team members
        Employee e2 = createStaff("EMP1002", "Marcus Vance", "marcus.vance@hardees.test", "(910) 555-0142",
                "Drive-Thru Specialist", "Front Counter", "Full-Time", 14.75, "Hardees@1002");
        Employee e3 = createStaff("EMP1003", "Elena Rostova", "elena.rostova@hardees.test", "(910) 555-0188",
                "Shift Supervisor", "Store Management", "Full-Time", 18.00, "Hardees@1003");
        Employee e4 = createStaff("EMP1004", "Tyler Hayes", "tyler.hayes@hardees.test", "(910) 555-0219",
                "Line Cook & Biscuit Maker", "Kitchen Operations", "Part-Time", 15.00, "Hardees@1004");
        Employee e5 = createStaff("EMP1005", "Aaliyah Patel", "aaliyah.patel@hardees.test", "(910) 555-0301",
                "Cashier & Hospitality", "Front Counter", "Full-Time", 14.50, "Hardees@1005");

        // Seed some attendance records for past days and today
        LocalDate today = LocalDate.now();

        // Jordan Miller past records
        addAttendance(demo, today.minusDays(3).atTime(5, 30), today.minusDays(3).atTime(14, 0), "Opening biscuit prep & breakfast");
        addAttendance(demo, today.minusDays(2).atTime(5, 30), today.minusDays(2).atTime(13, 30), "Breakfast & lunch grill rush");
        addAttendance(demo, today.minusDays(1).atTime(11, 0), today.minusDays(1).atTime(19, 30), "Lunch & dinner line support");

        // Elena Rostova (Shift Supervisor) checked in today on active shift
        addAttendance(e3, today.atTime(6, 0), null, "Morning shift supervisor duty");

        // Marcus Vance completed shift today
        addAttendance(e2, today.atTime(6, 30), today.atTime(14, 30), "Drive-thru peak speed of service");

        // Tyler Hayes completed shift today
        addAttendance(e4, today.atTime(4, 30), today.atTime(12, 30), "Early morning scratch biscuit baking");
    }

    private Employee createStaff(String code, String name, String email, String phone,
                                 String role, String dept, String empStatus, double rate, String pwd) {
        Employee e = new Employee();
        e.setEmployeeCode(code);
        e.setFullName(name);
        e.setEmail(email);
        e.setPhone(phone);
        e.setJobRole(role);
        e.setDepartment(dept);
        e.setEmploymentStatus(empStatus);
        e.setHourlyRate(rate);
        e.setAccountStatus("Active");
        employeeRepository.save(e);

        String userRole = "Shift Supervisor".equalsIgnoreCase(role) ? "STORE_MANAGER" : "EMPLOYEE";
        UserAccount u = new UserAccount(code, passwordEncoder.encode(pwd), userRole, name);
        userAccountRepository.save(u);
        return e;
    }

    private void addAttendance(Employee emp, LocalDateTime in, LocalDateTime out, String notes) {
        AttendanceRecord r = new AttendanceRecord();
        r.setEmployee(emp);
        r.setCheckIn(in);
        r.setCheckOut(out);
        r.setAttendanceDate(in.toLocalDate());
        r.setNotes(notes);
        if (out != null) {
            r.setShiftDurationMinutes(java.time.Duration.between(in, out).toMinutes());
        }
        attendanceRepository.save(r);
    }
}
