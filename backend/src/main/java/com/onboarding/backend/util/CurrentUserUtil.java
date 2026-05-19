package com.onboarding.backend.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.exception.ResourceNotFoundException;
import com.onboarding.backend.repository.UserRepository;
import com.onboarding.backend.security.AppUserDetails;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CurrentUserUtil {

	private final UserRepository userRepository;

	public AppUser getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails userDetails)) {
			throw new ResourceNotFoundException("Authenticated user not found");
		}

		return userRepository.findById(userDetails.getId())
			.orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
	}

	public Long getCurrentUserId() {
		return getCurrentUser().getId();
	}
}
