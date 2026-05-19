package com.onboarding.backend.service;

import org.springframework.stereotype.Service;

import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.Project;
import com.onboarding.backend.entity.Role;
import com.onboarding.backend.exception.ForbiddenActionException;
import com.onboarding.backend.repository.ProjectAssignmentRepository;
import com.onboarding.backend.util.CurrentUserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccessControlService {

	private final CurrentUserUtil currentUserUtil;
	private final ProjectAssignmentRepository projectAssignmentRepository;

	public AppUser currentUser() {
		return currentUserUtil.getCurrentUser();
	}

	public void assertCanViewProject(Project project) {
		AppUser user = currentUser();
		if (user.getRole() == Role.CUSTOMER && project.getCustomer().getId().equals(user.getId())) {
			return;
		}
		if (user.getRole() == Role.PROJECT_MANAGER && project.getManager().getId().equals(user.getId())) {
			return;
		}
		if (user.getRole() == Role.TEAM_MEMBER
			&& projectAssignmentRepository.existsByProjectIdAndTeamMemberId(project.getId(), user.getId())) {
			return;
		}
		throw new ForbiddenActionException("You do not have access to this project");
	}

	public void assertCustomerOwns(Project project) {
		AppUser user = currentUser();
		if (user.getRole() != Role.CUSTOMER || !project.getCustomer().getId().equals(user.getId())) {
			throw new ForbiddenActionException("Only the project customer can access this resource");
		}
	}

	public void assertManagerOwns(Project project) {
		AppUser user = currentUser();
		if (user.getRole() != Role.PROJECT_MANAGER || !project.getManager().getId().equals(user.getId())) {
			throw new ForbiddenActionException("Only the assigned project manager can perform this action");
		}
	}

	public void assertTeamMember(AppUser user) {
		if (user.getRole() != Role.TEAM_MEMBER) {
			throw new ForbiddenActionException("Selected assignee must be a team member");
		}
	}
}
