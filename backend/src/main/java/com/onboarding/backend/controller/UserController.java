package com.onboarding.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.onboarding.backend.dto.UserSummaryResponse;
import com.onboarding.backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/team-members")
	@PreAuthorize("hasRole('PROJECT_MANAGER')")
	@Operation(summary = "Get all team members", description = "Returns users with TEAM_MEMBER role.")
	public List<UserSummaryResponse> getTeamMembers() {
		return userService.getTeamMembers();
	}
}
