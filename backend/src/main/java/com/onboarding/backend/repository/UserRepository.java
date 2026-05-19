package com.onboarding.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.onboarding.backend.entity.AppUser;
import com.onboarding.backend.entity.ProjectStatus;
import com.onboarding.backend.entity.Role;

public interface UserRepository extends JpaRepository<AppUser, Long> {

	Optional<AppUser> findByEmail(String email);

	boolean existsByEmail(String email);

	List<AppUser> findByRole(Role role);

	@Query("""
		select u
		from AppUser u
		left join Project p on p.manager = u and p.status = :status
		where u.role = :role
		group by u
		order by count(p) asc, u.id asc
		""")
	List<AppUser> findLeastLoadedManagers(
		@Param("role") Role role,
		@Param("status") ProjectStatus status,
		Pageable pageable
	);
}
