package com.hardees.portal.repository;

import com.hardees.portal.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    Optional<AttendanceRecord> findFirstByEmployeeIdAndCheckOutIsNullOrderByCheckInDesc(Long employeeId);

    List<AttendanceRecord> findByEmployeeIdOrderByCheckInDesc(Long employeeId);

    List<AttendanceRecord> findByAttendanceDateOrderByCheckInDesc(LocalDate date);

    List<AttendanceRecord> findByAttendanceDateBetweenOrderByCheckInDesc(LocalDate startDate, LocalDate endDate);

    long countByCheckOutIsNull();

    long countByAttendanceDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.attendanceDate = :date AND a.checkOut IS NOT NULL")
    long countCompletedShiftsOnDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(a.shiftDurationMinutes), 0) FROM AttendanceRecord a WHERE a.attendanceDate = :date")
    long sumShiftDurationMinutesOnDate(@Param("date") LocalDate date);

    @Query("SELECT a FROM AttendanceRecord a WHERE " +
           "(:empId IS NULL OR a.employee.id = :empId) " +
           "AND (:startDate IS NULL OR a.attendanceDate >= :startDate) " +
           "AND (:endDate IS NULL OR a.attendanceDate <= :endDate) " +
           "ORDER BY a.checkIn DESC")
    List<AttendanceRecord> filterRecords(
            @Param("empId") Long empId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM AttendanceRecord a ORDER BY a.checkIn DESC")
    List<AttendanceRecord> findRecentActivity();
}
