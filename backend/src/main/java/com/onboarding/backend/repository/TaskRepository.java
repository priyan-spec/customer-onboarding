package com.onboarding.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.onboarding.backend.entity.Task;
import com.onboarding.backend.entity.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByAssigneeId(Long assigneeId);

	@Query("""
		select t
		from Task t
		where t.assignee.id = :assigneeId
		and exists (
			select 1
			from ProjectAssignment pa
			where pa.project = t.project
			and pa.teamMember = t.assignee
		)
		""")
	List<Task> findVisibleByAssigneeId(@Param("assigneeId") Long assigneeId);

	List<Task> findByProjectId(Long projectId);

	long countByProjectId(Long projectId);

	long countByProjectIdAndStatus(Long projectId, TaskStatus status);
}
