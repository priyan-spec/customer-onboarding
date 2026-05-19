package com.onboarding.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onboarding.backend.dto.UserSummaryResponse;
import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.Role;
import com.onboarding.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public List<UserSummaryResponse> getTeamMembers() {
		return userRepository.findByRole(Role.TEAM_MEMBER)
			.stream()
			.map(this::toSummary)
			.toList();
	}

	private UserSummaryResponse toSummary(AppUser user) {
		return new UserSummaryResponse(user.getId(), user.getName(), user.getEmail());
	}
}
