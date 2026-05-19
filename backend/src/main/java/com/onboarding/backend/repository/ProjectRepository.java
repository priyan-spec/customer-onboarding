package com.onboarding.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onboarding.backend.entity.Project;
import com.onboarding.backend.entity.ProjectStatus;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	List<Project> findByCustomerId(Long customerId);

	List<Project> findByManagerId(Long managerId);

	long countByManagerIdAndStatus(Long managerId, ProjectStatus status);
}
