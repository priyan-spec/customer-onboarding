package com.onboarding.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.onboarding.backend.entity.Priority;
import com.onboarding.backend.entity.ProjectStatus;

public record ProjectDetailResponse(
	Long projectId,
	String title,
	String description,
	String requirements,
	Priority priority,
	ProjectStatus status,
	LocalDate deadline,
	Integer progress,
	Long customerId,
	String customerName,
	Long managerId,
	String managerName,
	List<DocumentResponse> documents
) {
}
