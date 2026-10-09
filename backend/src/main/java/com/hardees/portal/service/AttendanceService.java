package com.hardees.portal.service;

import com.hardees.portal.dto.AttendanceStatusDto;
import com.hardees.portal.dto.ManagerStatsDto;
import com.hardees.portal.entity.AttendanceRecord;
import com.hardees.portal.entity.Employee;
import com.hardees.portal.repository.AttendanceRepository;
import com.hardees.portal.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public AttendanceRecord checkIn(String employeeCode, String notes) {
        Employee employee = employeeRepository.findByEmployeeCodeIgnoreCase(employeeCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: " + employeeCode));

        if (!"Active".equalsIgnoreCase(employee.getAccountStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Employee account is not active");
        }

        // Prevent duplicate open shift
        Optional<AttendanceRecord> openShift = attendanceRepository.findFirstByEmployeeIdAndCheckOutIsNullOrderByCheckInDesc(employee.getId());
        if (openShift.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Employee already has an active open shift checked in at " + openShift.get().getCheckIn());
        }

        AttendanceRecord record = new AttendanceRecord();
        record.setEmployee(employee);
        record.setCheckIn(LocalDateTime.now());
        record.setAttendanceDate(LocalDate.now());
        record.setNotes(notes);
        return attendanceRepository.save(record);
    }

    @Transactional
    public AttendanceRecord checkOut(String employeeCode, String notes) {
        Employee employee = employeeRepository.findByEmployeeCodeIgnoreCase(employeeCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: " + employeeCode));

        AttendanceRecord openShift = attendanceRepository.findFirstByEmployeeIdAndCheckOutIsNullOrderByCheckInDesc(employee.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "No active check-in found for this employee"));

        LocalDateTime now = LocalDateTime.now();
        openShift.setCheckOut(now);
        long minutes = Math.max(1, Duration.between(openShift.getCheckIn(), now).toMinutes());
        openShift.setShiftDurationMinutes(minutes);
        if (notes != null && !notes.isBlank()) {
            openShift.setNotes(openShift.getNotes() != null ? openShift.getNotes() + " | " + notes : notes);
        }

        return attendanceRepository.save(openShift);
    }

    @Transactional(readOnly = true)
    public AttendanceStatusDto getEmployeeStatus(String employeeCode) {
        Employee employee = employeeRepository.findByEmployeeCodeIgnoreCase(employeeCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: " + employeeCode));

        AttendanceStatusDto dto = new AttendanceStatusDto();
        LocalDate today = LocalDate.now();

        // Check if there is an active open shift
        Optional<AttendanceRecord> openShift = attendanceRepository.findFirstByEmployeeIdAndCheckOutIsNullOrderByCheckInDesc(employee.getId());

        if (openShift.isPresent()) {
            AttendanceRecord rec = openShift.get();
            dto.setStatus("ON_SHIFT");
            dto.setCheckInTime(rec.getCheckIn());
            dto.setActiveRecordId(rec.getId());
            long liveMins = Duration.between(rec.getCheckIn(), LocalDateTime.now()).toMinutes();
            dto.setLiveMinutes(liveMins);
            dto.setHoursToday(Math.round((liveMins / 60.0) * 10) / 10.0);
            return dto;
        }

        // Check if employee completed any shift today
        List<AttendanceRecord> todayRecords = attendanceRepository.findByAttendanceDateOrderByCheckInDesc(today);
        Optional<AttendanceRecord> completedToday = todayRecords.stream()
                .filter(r -> r.getEmployee().getId().equals(employee.getId()) && r.getCheckOut() != null)
                .findFirst();

        if (completedToday.isPresent()) {
            AttendanceRecord rec = completedToday.get();
            dto.setStatus("SHIFT_COMPLETED");
            dto.setCheckInTime(rec.getCheckIn());
            dto.setCheckOutTime(rec.getCheckOut());
            long totalMinutes = todayRecords.stream()
                    .filter(r -> r.getEmployee().getId().equals(employee.getId()) && r.getShiftDurationMinutes() != null)
                    .mapToLong(AttendanceRecord::getShiftDurationMinutes)
                    .sum();
            dto.setHoursToday(Math.round((totalMinutes / 60.0) * 10) / 10.0);
            return dto;
        }

        dto.setStatus("NOT_CHECKED_IN");
        dto.setHoursToday(0.0);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecord> getEmployeeAttendanceHistory(String employeeCode) {
        Employee employee = employeeRepository.findByEmployeeCodeIgnoreCase(employeeCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: " + employeeCode));
        return attendanceRepository.findByEmployeeIdOrderByCheckInDesc(employee.getId());
    }

    @Transactional(readOnly = true)
    public ManagerStatsDto getManagerStats() {
        ManagerStatsDto stats = new ManagerStatsDto();
        long totalEmp = employeeRepository.count();
        long activeEmp = employeeRepository.findByAccountStatus("Active").size();
        long checkedIn = attendanceRepository.countByCheckOutIsNull();
        long notCheckedIn = Math.max(0, activeEmp - checkedIn);
        LocalDate today = LocalDate.now();
        long todayCount = attendanceRepository.countByAttendanceDate(today);
        long completedToday = attendanceRepository.countCompletedShiftsOnDate(today);
        long minutesToday = attendanceRepository.sumShiftDurationMinutesOnDate(today);

        stats.setTotalEmployees(totalEmp);
        stats.setActiveEmployees(activeEmp);
        stats.setCurrentlyCheckedIn(checkedIn);
        stats.setNotCheckedIn(notCheckedIn);
        stats.setTodayAttendanceCount(todayCount);
        stats.setCompletedShiftsToday(completedToday);
        stats.setTotalHoursToday(Math.round((minutesToday / 60.0) * 10) / 10.0);

        List<AttendanceRecord> recents = attendanceRepository.findRecentActivity();
        if (recents.size() > 10) {
            recents = recents.subList(0, 10);
        }
        stats.setRecentActivity(recents);

        return stats;
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecord> filterAttendance(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.filterRecords(employeeId, startDate, endDate);
    }

    public String generateAttendanceCsv(List<AttendanceRecord> records) {
        StringBuilder sb = new StringBuilder();
        sb.append("Record ID,Employee Code,Employee Name,Department,Role,Date,Check In,Check Out,Shift Hours,Status,Notes\n");
        DateTimeFormatter dtFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (AttendanceRecord r : records) {
            sb.append(r.getId()).append(",");
            sb.append("\"").append(r.getEmployee() != null ? r.getEmployee().getEmployeeCode() : "").append("\",");
            sb.append("\"").append(r.getEmployee() != null ? r.getEmployee().getFullName().replace("\"", "\"\"") : "").append("\",");
            sb.append("\"").append(r.getEmployee() != null ? r.getEmployee().getDepartment() : "").append("\",");
            sb.append("\"").append(r.getEmployee() != null ? r.getEmployee().getJobRole() : "").append("\",");
            sb.append(r.getAttendanceDate() != null ? r.getAttendanceDate().toString() : "").append(",");
            sb.append(r.getCheckIn() != null ? r.getCheckIn().format(dtFormatter) : "").append(",");
            sb.append(r.getCheckOut() != null ? r.getCheckOut().format(dtFormatter) : "OPEN").append(",");
            sb.append(r.getShiftHours()).append(",");
            sb.append(r.getStatus()).append(",");
            sb.append("\"").append(r.getNotes() != null ? r.getNotes().replace("\"", "\"\"") : "").append("\"\n");
        }
        return sb.toString();
    }
}
