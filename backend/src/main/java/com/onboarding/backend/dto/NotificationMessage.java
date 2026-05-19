package com.onboarding.backend.dto;

import java.time.LocalDateTime;

import com.onboarding.backend.entity.NotificationType;

public record NotificationMessage(
	NotificationType type,
	String message,
	Long projectId,
	Long taskId,
	Long recipientId,
	LocalDateTime createdAt
) {
}
