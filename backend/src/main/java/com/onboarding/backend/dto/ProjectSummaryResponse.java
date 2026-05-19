package com.onboarding.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.onboarding.backend.entity.Priority;
import com.onboarding.backend.entity.ProjectStatus;

public record ProjectSummaryResponse(
	Long projectId,
	String title,
	String customerName,
	ProjectStatus status,
	Priority priority,
	LocalDate deadline,
	Integer progress,
	String requirements,
	List<DocumentResponse> documents
) {
}
