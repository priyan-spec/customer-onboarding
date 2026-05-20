import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { managerNav } from '../../data/mockData.js'
import {
  assignTeamMember,
  createTask,
  deleteProjectAssignment,
  deleteTask,
  downloadDocument,
  getAssignedTeamMembers,
  getProject,
  getTasksByProject,
  getTeamMembers,
  updateProjectAssignment,
  updateTask,
} from '../../services/api.js'

function priorityClass(priority) {
  if (priority === 'HIGH') return 'badge-soft-red'
  if (priority === 'MEDIUM') return 'badge-soft-amber'
  return 'badge-soft-green'
}

function statusClass(status) {
  if (status === 'DONE') return 'badge-soft-green'
  if (status === 'IN_PROGRESS') return 'badge-soft-blue'
  return 'badge-soft-amber'
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ProjectDetails() {
  const { projectId } = useParams()
  const numericProjectId = Number(projectId)
  const [project, setProject] = useState(null)
  const [projectTasks, setProjectTasks] = useState([])
  const [assignedMembers, setAssignedMembers] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [taskDraft, setTaskDraft] = useState(null)
  const [memberDraft, setMemberDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadProjectWork = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [projectData, tasksData, membersData, allTeamMembers] = await Promise.all([
        getProject(numericProjectId),
        getTasksByProject(numericProjectId),
        getAssignedTeamMembers(numericProjectId),
        getTeamMembers(),
      ])

      setProject(projectData)
      setProjectTasks(tasksData)
      setAssignedMembers(membersData)
      setTeamMembers(allTeamMembers)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [numericProjectId])

  useEffect(() => {
    let cancelled = false

    async function loadInitialProjectWork() {
      try {
        setLoading(true)
        setError('')
        const [projectData, tasksData, membersData, allTeamMembers] = await Promise.all([
          getProject(numericProjectId),
          getTasksByProject(numericProjectId),
          getAssignedTeamMembers(numericProjectId),
          getTeamMembers(),
        ])

        if (!cancelled) {
          setProject(projectData)
          setProjectTasks(tasksData)
          setAssignedMembers(membersData)
          setTeamMembers(allTeamMembers)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialProjectWork()

    return () => {
      cancelled = true
    }
  }, [numericProjectId])

  useEffect(() => {
    function handleNotification(event) {
      if (Number(event.detail?.projectId) === numericProjectId) {
        loadProjectWork()
      }
    }

    window.addEventListener('onboarding:notification', handleNotification)
    return () => {
      window.removeEventListener('onboarding:notification', handleNotification)
    }
  }, [loadProjectWork, numericProjectId])

  function openNewTask() {
    setMessage('')
    setTaskDraft({
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: '',
      assignee: assignedMembers[0]?.teamMemberId ?? '',
    })
  }

  async function saveTask() {
    try {
      const selectedAssigneeId = taskDraft.assignee ? Number(taskDraft.assignee) : null
      const selectedAssigneeIsAssigned = assignedMembers.some((member) => member.teamMemberId === selectedAssigneeId)

      if (!taskDraft.taskId && !selectedAssigneeIsAssigned) {
        setMessage('Assign a team member to the project before creating a task.')
        return
      }

      if (taskDraft.taskId) {
        const payload = {
          title: taskDraft.title,
          description: taskDraft.description,
          priority: taskDraft.priority,
          dueDate: taskDraft.dueDate,
          status: taskDraft.status,
        }

        if (selectedAssigneeIsAssigned) {
          payload.assignee = selectedAssigneeId
        }

        await updateTask(taskDraft.taskId, payload)
        setMessage('Task updated successfully.')
      } else {
        await createTask({
          projectId: numericProjectId,
          title: taskDraft.title,
          description: taskDraft.description,
          assignee: selectedAssigneeId,
          priority: taskDraft.priority,
          dueDate: taskDraft.dueDate,
        })
        setMessage('Task created successfully.')
      }

      setTaskDraft(null)
      await loadProjectWork()
    } catch (saveError) {
      setMessage(saveError.message)
    }
  }

  async function removeTask(taskId) {
    try {
      await deleteTask(taskId)
      setMessage('Task deleted successfully.')
      await loadProjectWork()
    } catch (deleteError) {
      setMessage(deleteError.message)
    }
  }

  function openNewMember() {
    const nextMember = teamMembers.find((member) => !assignedMembers.some((assigned) => assigned.teamMemberId === member.id))
    setMessage('')
    setMemberDraft({
      id: null,
      teamMemberId: nextMember?.id ?? '',
      assignedRole: 'IMPLEMENTATION_SPECIALIST',
    })
  }

  async function saveMember() {
    try {
      if (memberDraft.id) {
        await updateProjectAssignment(memberDraft.id, { assignedRole: memberDraft.assignedRole })
        setMessage('Assignment updated successfully.')
      } else {
        await assignTeamMember({
          projectId: numericProjectId,
          teamMemberId: Number(memberDraft.teamMemberId),
          assignedRole: memberDraft.assignedRole,
        })
        setMessage('Team member assigned successfully.')
      }

      setMemberDraft(null)
      await loadProjectWork()
    } catch (saveError) {
      setMessage(saveError.message)
    }
  }

  async function removeMember(assignmentId) {
    try {
      await deleteProjectAssignment(assignmentId)
      setMessage('Assignment removed successfully.')
      await loadProjectWork()
    } catch (deleteError) {
      setMessage(deleteError.message)
    }
  }

  async function handleDocumentDownload(document) {
    try {
      await downloadDocument(document.id, document.fileName)
    } catch (downloadError) {
      setMessage(downloadError.message)
    }
  }

  return (
    <DashboardLayout
      title="Project details"
      subtitle="Manage requirements, project tasks, and assigned members."
      navItems={managerNav}
      roleLabel="Project Manager"
      userName="Maya Singh"
    >
      {loading && <div className="app-card p-4 text-center text-secondary">Loading project details...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-info" role="status">{message}</div>}

      {!loading && project && (
        <>
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
            <div>
              <Link to="/manager" className="small text-decoration-none text-primary">
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
                Back to assigned projects
              </Link>
              <h2 className="h3 fw-bold mt-2 mb-1">{project.title}</h2>
              <p className="text-secondary mb-0">{project.description}</p>
            </div>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
              <span className={`badge rounded-pill fs-6 ${project.status === 'COMPLETED' ? 'badge-soft-green' : 'badge-soft-blue'}`}>
                {project.status}
              </span>
              <a href="#tasks" className="btn btn-outline-primary">
                <i className="bi bi-list-check me-2" aria-hidden="true"></i>
                Add Task
              </a>
              <a href="#members" className="btn btn-primary">
                <i className="bi bi-person-plus me-2" aria-hidden="true"></i>
                Assign Members
              </a>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-xl-4">
              <section className="app-card p-3 p-xl-4 h-100">
                <h2 className="h5 fw-bold mb-3">Customer information</h2>
                <div className="vstack gap-3">
                  <div>
                    <p className="small text-secondary mb-1">Customer</p>
                    <p className="fw-semibold mb-0">{project.customerName}</p>
                  </div>
                  <div>
                    <p className="small text-secondary mb-1">Manager</p>
                    <p className="fw-semibold mb-0">{project.managerName}</p>
                  </div>
                  <div>
                    <p className="small text-secondary mb-1">Deadline</p>
                    <p className="fw-semibold mb-0">{project.deadline}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="col-12 col-xl-8">
              <section className="app-card p-3 p-xl-4 h-100">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                  <div>
                    <h2 className="h5 fw-bold mb-1">Project progress</h2>
                    <p className="text-secondary mb-0">{project.priority} priority</p>
                  </div>
                  <span className="h4 fw-bold text-primary mb-0">{project.progress}%</span>
                </div>
                <div className="progress mb-4" role="progressbar" aria-label={`${project.title} progress`} aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${project.progress}%` }}></div>
                </div>
                <h3 className="h6 fw-bold">Requirements</h3>
                <p className="text-secondary mb-4">{project.requirements}</p>
                <h3 className="h6 fw-bold">Documents</h3>
                <div className="d-flex flex-wrap gap-2">
                  {(project.documents ?? []).map((document) => (
                    <button
                      className="badge text-bg-light border fw-normal"
                      type="button"
                      key={document.id}
                      onClick={() => handleDocumentDownload(document)}
                    >
                      <i className="bi bi-file-earmark-text me-1 text-primary" aria-hidden="true"></i>
                      {document.fileName}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="col-12" id="tasks">
              <section className="app-card p-3 p-xl-4">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                  <div>
                    <h2 className="h5 fw-bold mb-1">Project tasks</h2>
                    <p className="text-secondary mb-0">Add, update, or delete tasks for this project.</p>
                  </div>
                  <button className="btn btn-outline-primary" type="button" onClick={openNewTask}>
                    <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                    Add Task
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Assignee</th>
                        <th>Due date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectTasks.map((task) => (
                        <tr key={task.taskId}>
                          <td>
                            <span className="d-block fw-semibold">{task.title}</span>
                            <span className="d-block small text-secondary">{task.description}</span>
                          </td>
                          <td>
                            {task.assigneeName ? (
                              task.assigneeName
                            ) : (
                              <span className="badge text-bg-light border text-secondary">Unassigned</span>
                            )}
                          </td>
                          <td>{task.dueDate}</td>
                          <td><span className={`badge rounded-pill ${priorityClass(task.priority)}`}>{task.priority}</span></td>
                          <td><span className={`badge rounded-pill ${statusClass(task.status)}`}>{task.status}</span></td>
                          <td>
                            <div className="d-flex flex-column flex-sm-row gap-2">
                              <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setTaskDraft({ ...task, assignee: task.assigneeId ?? '' })}>
                                Update
                              </button>
                              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeTask(task.taskId)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {projectTasks.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center text-secondary">No tasks yet. Add a task after assigning a member.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="col-12" id="members">
              <section className="app-card p-3 p-xl-4">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                  <div>
                    <h2 className="h5 fw-bold mb-1">Assigned members</h2>
                    <p className="text-secondary mb-0">Assign, update, or delete members for this project.</p>
                  </div>
                  <button className="btn btn-primary" type="button" onClick={openNewMember}>
                    <i className="bi bi-person-plus me-2" aria-hidden="true"></i>
                    Assign Members
                  </button>
                </div>
                <div className="row g-3">
                  {assignedMembers.map((member) => (
                    <div className="col-12 col-md-6 col-xl-4" key={member.id}>
                      <div className="member-card p-3 h-100">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <span className="avatar lg">{initials(member.name)}</span>
                          <div>
                            <h3 className="h6 fw-bold mb-1">{member.name}</h3>
                            <p className="small text-secondary mb-0">{member.email}</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between small mb-3">
                          <span className="text-secondary">Role</span>
                          <span className="fw-semibold">{member.assignedRole}</span>
                        </div>
                        <div className="d-flex justify-content-between small mb-3">
                          <span className="text-secondary">Assigned date</span>
                          <span className="fw-semibold">{member.assignedDate}</span>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary flex-fill" type="button" onClick={() => setMemberDraft({ ...member })}>
                            Update
                          </button>
                          <button className="btn btn-sm btn-outline-danger flex-fill" type="button" onClick={() => removeMember(member.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {assignedMembers.length === 0 && (
                    <div className="col-12">
                      <div className="text-center text-secondary p-4 border rounded">
                        No members assigned yet.
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      )}

      {taskDraft && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5">{taskDraft.taskId ? 'Update Task' : 'Add Task'}</h2>
                  <button type="button" className="btn-close" onClick={() => setTaskDraft(null)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold" htmlFor="taskTitle">Task Title</label>
                      <input id="taskTitle" className="form-control" value={taskDraft.title} onChange={(event) => setTaskDraft({ ...taskDraft, title: event.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold" htmlFor="taskDescription">Task Description</label>
                      <textarea id="taskDescription" className="form-control" rows="3" value={taskDraft.description} onChange={(event) => setTaskDraft({ ...taskDraft, description: event.target.value })}></textarea>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="taskAssignee">Assignee</label>
                      <select id="taskAssignee" className="form-select" value={taskDraft.assignee} onChange={(event) => setTaskDraft({ ...taskDraft, assignee: event.target.value })}>
                        <option value="">Select member</option>
                        {taskDraft.assigneeName && taskDraft.assignee && !assignedMembers.some((member) => member.teamMemberId === Number(taskDraft.assignee)) && (
                          <option value={taskDraft.assignee} disabled>{taskDraft.assigneeName} (removed)</option>
                        )}
                        {assignedMembers.map((member) => (
                          <option key={member.teamMemberId} value={member.teamMemberId}>{member.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="taskDueDate">Due Date</label>
                      <input id="taskDueDate" className="form-control" type="date" value={taskDraft.dueDate} onChange={(event) => setTaskDraft({ ...taskDraft, dueDate: event.target.value })} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="taskPriority">Priority</label>
                      <select id="taskPriority" className="form-select" value={taskDraft.priority} onChange={(event) => setTaskDraft({ ...taskDraft, priority: event.target.value })}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="taskStatus">Status</label>
                      <select id="taskStatus" className="form-select" value={taskDraft.status} onChange={(event) => setTaskDraft({ ...taskDraft, status: event.target.value })}>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setTaskDraft(null)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={saveTask}>Save Task</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {memberDraft && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5">{memberDraft.id ? 'Update Member' : 'Assign Member'}</h2>
                  <button type="button" className="btn-close" onClick={() => setMemberDraft(null)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label fw-semibold" htmlFor="memberName">Member</label>
                      <select
                        id="memberName"
                        className="form-select"
                        value={memberDraft.teamMemberId}
                        disabled={Boolean(memberDraft.id)}
                        onChange={(event) => setMemberDraft({ ...memberDraft, teamMemberId: event.target.value })}
                      >
                        <option value="">Select member</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label fw-semibold" htmlFor="memberRole">Assigned Role</label>
                      <input id="memberRole" className="form-control" value={memberDraft.assignedRole} onChange={(event) => setMemberDraft({ ...memberDraft, assignedRole: event.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setMemberDraft(null)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={saveMember}>Save Member</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </DashboardLayout>
  )
}

export default ProjectDetails
