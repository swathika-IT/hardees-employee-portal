package com.hardees.portal.dto;

import com.hardees.portal.entity.AttendanceRecord;
import java.util.List;

public class ManagerStatsDto {
    private long totalEmployees;
    private long activeEmployees;
    private long currentlyCheckedIn;
    private long notCheckedIn;
    private long completedShiftsToday;
    private long todayAttendanceCount;
    private double totalHoursToday;
    private List<AttendanceRecord> recentActivity;

    public ManagerStatsDto() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getCurrentlyCheckedIn() { return currentlyCheckedIn; }
    public void setCurrentlyCheckedIn(long currentlyCheckedIn) { this.currentlyCheckedIn = currentlyCheckedIn; }

    public long getNotCheckedIn() { return notCheckedIn; }
    public void setNotCheckedIn(long notCheckedIn) { this.notCheckedIn = notCheckedIn; }

    public long getCompletedShiftsToday() { return completedShiftsToday; }
    public void setCompletedShiftsToday(long completedShiftsToday) { this.completedShiftsToday = completedShiftsToday; }

    public long getTodayAttendanceCount() { return todayAttendanceCount; }
    public void setTodayAttendanceCount(long todayAttendanceCount) { this.todayAttendanceCount = todayAttendanceCount; }

    public double getTotalHoursToday() { return totalHoursToday; }
    public void setTotalHoursToday(double totalHoursToday) { this.totalHoursToday = totalHoursToday; }

    public List<AttendanceRecord> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<AttendanceRecord> recentActivity) { this.recentActivity = recentActivity; }
}
