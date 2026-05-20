package com.onboarding.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.onboarding.backend.entity.NotificationType;

public record NotificationMessage(
	NotificationType type,
	String message,
	Long projectId,
	Long taskId,
	Long recipientId,
	LocalDateTime createdAt,
	List<Long> recipientIds
) {
}
