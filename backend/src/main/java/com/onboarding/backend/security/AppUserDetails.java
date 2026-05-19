package com.onboarding.backend.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.Role;

public class AppUserDetails implements UserDetails {

	private final Long id;
	private final String email;
	private final String password;
	private final Role role;

	public AppUserDetails(AppUser user) {
		this.id = user.getId();
		this.email = user.getEmail();
		this.password = user.getPassword();
		this.role = user.getRole();
	}

	public Long getId() {
		return id;
	}

	public Role getRole() {
		return role;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
