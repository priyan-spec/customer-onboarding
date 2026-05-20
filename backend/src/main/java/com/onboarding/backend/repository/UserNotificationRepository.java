package com.onboarding.backend.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.onboarding.backend.entity.UserNotification;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {

	List<UserNotification> findByRecipient_IdOrderByCreatedAtDescIdDesc(Long recipientId, Pageable pageable);
}
