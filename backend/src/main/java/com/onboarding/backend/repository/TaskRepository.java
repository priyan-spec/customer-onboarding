package com.onboarding.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.onboarding.backend.entity.Task;
import com.onboarding.backend.entity.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByAssigneeId(Long assigneeId);

	default List<Task> findVisibleByAssigneeId(Long assigneeId) {
		return findVisibleByAssigneeIdAndDoneStatus(assigneeId, TaskStatus.DONE);
	}

	@Query("""
		select t
		from Task t
		where t.assignee.id = :assigneeId
		and (
			t.status = :doneStatus
			or exists (
				select 1
				from ProjectAssignment pa
				where pa.project = t.project
				and pa.teamMember = t.assignee
			)
		)
		""")
	List<Task> findVisibleByAssigneeIdAndDoneStatus(
		@Param("assigneeId") Long assigneeId,
		@Param("doneStatus") TaskStatus doneStatus
	);

	List<Task> findByProjectId(Long projectId);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("""
		update Task t
		set t.assignee = null
		where t.project.id = :projectId
		and t.assignee.id = :assigneeId
		and t.status <> :doneStatus
		""")
	int clearOpenTaskAssigneeForRemovedMember(
		@Param("projectId") Long projectId,
		@Param("assigneeId") Long assigneeId,
		@Param("doneStatus") TaskStatus doneStatus
	);

	long countByProjectId(Long projectId);

	long countByProjectIdAndStatus(Long projectId, TaskStatus status);
}
