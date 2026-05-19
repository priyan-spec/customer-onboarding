package com.onboarding.backend.dto;

import java.time.LocalDate;

import com.onboarding.backend.entity.Priority;
import com.onboarding.backend.entity.TaskStatus;

public record TaskResponse(
	Long taskId,
	Long projectId,
	String projectTitle,
	String title,
	String description,
	Long assigneeId,
	String assigneeName,
	Priority priority,
	LocalDate dueDate,
	TaskStatus status
) {
}
