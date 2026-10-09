package com.hardees.portal.repository;

import com.hardees.portal.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmployeeIdIgnoreCase(String employeeId);
    Optional<UserAccount> findBySessionToken(String sessionToken);
    boolean existsByEmployeeIdIgnoreCase(String employeeId);
}
