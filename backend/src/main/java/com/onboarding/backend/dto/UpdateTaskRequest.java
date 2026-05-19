package com.onboarding.backend.dto;

import java.time.LocalDate;

import com.onboarding.backend.entity.Priority;
import com.onboarding.backend.entity.TaskStatus;

import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(
	@Size(max = 160) String title,
	@Size(max = 1000) String description,
	Long assignee,
	Priority priority,
	LocalDate dueDate,
	TaskStatus status
) {
}
