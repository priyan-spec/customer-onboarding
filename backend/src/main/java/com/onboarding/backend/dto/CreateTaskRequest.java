package com.onboarding.backend.dto;

import java.time.LocalDate;

import com.onboarding.backend.entity.Priority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
	@NotNull Long projectId,
	@NotBlank @Size(max = 160) String title,
	@NotBlank @Size(max = 1000) String description,
	@NotNull Priority priority,
	@NotNull LocalDate dueDate,
	@NotNull Long assignee
) {
}
