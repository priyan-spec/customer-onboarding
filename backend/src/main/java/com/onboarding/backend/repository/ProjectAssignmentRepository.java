package com.onboarding.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onboarding.backend.entity.ProjectAssignment;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long> {

	List<ProjectAssignment> findByProjectId(Long projectId);

	boolean existsByProjectIdAndTeamMemberId(Long projectId, Long teamMemberId);

	Optional<ProjectAssignment> findByProjectIdAndTeamMemberId(Long projectId, Long teamMemberId);
}
