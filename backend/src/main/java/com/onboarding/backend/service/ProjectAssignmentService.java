package com.onboarding.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onboarding.backend.dto.MessageResponse;
import com.onboarding.backend.dto.ProjectAssignmentRequest;
import com.onboarding.backend.dto.ProjectAssignmentResponse;
import com.onboarding.backend.dto.UpdateProjectAssignmentRequest;
import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.Project;
import com.onboarding.backend.entity.ProjectAssignment;
import com.onboarding.backend.entity.TaskStatus;
import com.onboarding.backend.exception.BadRequestException;
import com.onboarding.backend.exception.ResourceNotFoundException;
import com.onboarding.backend.repository.ProjectAssignmentRepository;
import com.onboarding.backend.repository.TaskRepository;
import com.onboarding.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectAssignmentService {

	private final ProjectAssignmentRepository projectAssignmentRepository;
	private final UserRepository userRepository;
	private final TaskRepository taskRepository;
	private final ProjectService projectService;
	private final AccessControlService accessControlService;

	@Transactional
	public MessageResponse assignTeamMember(ProjectAssignmentRequest request) {
		Project project = projectService.findProject(request.projectId());
		accessControlService.assertManagerOwns(project);

		AppUser teamMember = findUser(request.teamMemberId());
		accessControlService.assertTeamMember(teamMember);
		if (projectAssignmentRepository.existsByProjectIdAndTeamMemberId(project.getId(), teamMember.getId())) {
			throw new BadRequestException("Team member is already assigned to this project");
		}

		ProjectAssignment assignment = ProjectAssignment.builder()
			.project(project)
			.teamMember(teamMember)
			.assignedRole(request.assignedRole())
			.build();
		projectAssignmentRepository.save(assignment);
		return new MessageResponse("Team Member Assigned Successfully");
	}

	@Transactional
	public MessageResponse updateAssignment(Long id, UpdateProjectAssignmentRequest request) {
		ProjectAssignment assignment = findAssignment(id);
		accessControlService.assertManagerOwns(assignment.getProject());
		assignment.setAssignedRole(request.assignedRole());
		projectAssignmentRepository.save(assignment);
		return new MessageResponse("Assignment Updated Successfully");
	}

	@Transactional(readOnly = true)
	public List<ProjectAssignmentResponse> getAssignedTeamMembers(Long projectId) {
		Project project = projectService.findProject(projectId);
		accessControlService.assertManagerOwns(project);
		return projectAssignmentRepository.findByProjectId(projectId).stream()
			.map(this::toResponse)
			.toList();
	}

	@Transactional
	public MessageResponse deleteAssignment(Long id) {
		ProjectAssignment assignment = findAssignment(id);
		Project project = assignment.getProject();
		Long teamMemberId = assignment.getTeamMember().getId();
		accessControlService.assertManagerOwns(project);

		int clearedTasks = taskRepository.clearOpenTaskAssigneeForRemovedMember(project.getId(), teamMemberId, TaskStatus.DONE);
		projectAssignmentRepository.delete(assignment);
		if (clearedTasks > 0) {
			projectService.refreshProjectProgress(project);
		}
		return new MessageResponse("Assignment Removed Successfully");
	}

	private ProjectAssignment findAssignment(Long id) {
		return projectAssignmentRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Project assignment not found"));
	}

	private AppUser findUser(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	private ProjectAssignmentResponse toResponse(ProjectAssignment assignment) {
		return new ProjectAssignmentResponse(
			assignment.getId(),
			assignment.getTeamMember().getId(),
			assignment.getTeamMember().getName(),
			assignment.getTeamMember().getEmail(),
			assignment.getAssignedRole(),
			assignment.getAssignedDate()
		);
	}
}
