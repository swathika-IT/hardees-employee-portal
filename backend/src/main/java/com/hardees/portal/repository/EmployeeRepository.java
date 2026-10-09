package com.hardees.portal.repository;

import com.hardees.portal.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCodeIgnoreCase(String employeeCode);
    boolean existsByEmployeeCodeIgnoreCase(String employeeCode);

    List<Employee> findByAccountStatus(String accountStatus);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:dept IS NULL OR :dept = '' OR e.department = :dept) " +
           "AND (:status IS NULL OR :status = '' OR e.accountStatus = :status) " +
           "ORDER BY e.fullName ASC")
    List<Employee> searchEmployees(@Param("query") String query, @Param("dept") String dept, @Param("status") String status);
}
