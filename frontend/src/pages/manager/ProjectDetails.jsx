import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { managerNav, projects, tasks, teamMembers } from '../../data/mockData.js'

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

function ProjectDetails() {
  const { projectId } = useParams()
  const project = projects.find((item) => item.id === projectId) ?? projects[0]
  const initialTasks = useMemo(() => {
    const matchingTasks = tasks.filter((task) => task.project === project.title)
    return (matchingTasks.length ? matchingTasks : tasks.slice(0, 2)).map((task) => ({
      ...task,
      project: project.title,
    }))
  }, [project.title])

  const [projectTasks, setProjectTasks] = useState(initialTasks)
  const [assignedMembers, setAssignedMembers] = useState(() => teamMembers.slice(0, 2))
  const [taskDraft, setTaskDraft] = useState(null)
  const [memberDraft, setMemberDraft] = useState(null)

  function openNewTask() {
    setTaskDraft({
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: 'Jun 15, 2026',
      assignee: assignedMembers[0]?.name ?? teamMembers[0].name,
      project: project.title,
    })
  }

  function saveTask() {
    const existingTask = projectTasks.some((task) => task.id === taskDraft.id)

    setProjectTasks((items) =>
      existingTask
        ? items.map((task) => (task.id === taskDraft.id ? taskDraft : task))
        : [taskDraft, ...items],
    )
    setTaskDraft(null)
  }

  function deleteTask(taskId) {
    setProjectTasks((items) => items.filter((task) => task.id !== taskId))
  }

  function openNewMember() {
    const nextMember = teamMembers.find((member) => !assignedMembers.some((assigned) => assigned.id === member.id))
    setMemberDraft(nextMember ? { ...nextMember } : { ...teamMembers[0], id: '' })
  }

  function updateMemberFromSelect(memberId) {
    const selectedMember = teamMembers.find((member) => member.id === Number(memberId))

    if (selectedMember) {
      setMemberDraft({ ...selectedMember })
    }
  }

  function saveMember() {
    const memberExists = assignedMembers.some((member) => member.id === memberDraft.id)

    setAssignedMembers((items) =>
      memberExists
        ? items.map((member) => (member.id === memberDraft.id ? memberDraft : member))
        : [memberDraft, ...items],
    )
    setMemberDraft(null)
  }

  function deleteMember(memberId) {
    setAssignedMembers((items) => items.filter((member) => member.id !== memberId))
  }

  return (
    <DashboardLayout
      title="Project details"
      subtitle="Manage requirements, project tasks, and assigned members."
      navItems={managerNav}
      roleLabel="Project Manager"
      userName="Maya Singh"
    >
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
          <span className={`badge rounded-pill fs-6 ${project.status === 'Completed' ? 'badge-soft-green' : 'badge-soft-blue'}`}>
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
                <p className="fw-semibold mb-0">{project.customer}</p>
              </div>
              <div>
                <p className="small text-secondary mb-1">Contact</p>
                <p className="fw-semibold mb-0">{project.contact}</p>
              </div>
              <div>
                <p className="small text-secondary mb-1">Email</p>
                <p className="fw-semibold mb-0">{project.email}</p>
              </div>
              <div>
                <p className="small text-secondary mb-1">Owner</p>
                <p className="fw-semibold mb-0">{project.owner}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-8">
          <section className="app-card p-3 p-xl-4 h-100">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div>
                <h2 className="h5 fw-bold mb-1">Project progress</h2>
                <p className="text-secondary mb-0">{project.phase} phase</p>
              </div>
              <span className="h4 fw-bold text-primary mb-0">{project.progress}%</span>
            </div>
            <div className="progress mb-4" role="progressbar" aria-label={`${project.title} progress`} aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${project.progress}%` }}></div>
            </div>
            <h3 className="h6 fw-bold">Requirements</h3>
            <p className="text-secondary mb-0">{project.requirements}</p>
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
                    <tr key={task.id}>
                      <td>
                        <span className="d-block fw-semibold">{task.title}</span>
                        <span className="d-block small text-secondary">{task.description}</span>
                      </td>
                      <td>{task.assignee}</td>
                      <td>{task.dueDate}</td>
                      <td><span className={`badge rounded-pill ${priorityClass(task.priority)}`}>{task.priority}</span></td>
                      <td><span className={`badge rounded-pill ${statusClass(task.status)}`}>{task.status}</span></td>
                      <td>
                        <div className="d-flex flex-column flex-sm-row gap-2">
                          <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setTaskDraft({ ...task })}>
                            Update
                          </button>
                          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteTask(task.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                      <span className="avatar lg">{member.avatar}</span>
                      <div>
                        <h3 className="h6 fw-bold mb-1">{member.name}</h3>
                        <p className="small text-secondary mb-0">{member.role}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between small mb-3">
                      <span className="text-secondary">Assigned date</span>
                      <span className="fw-semibold">{member.assignedDate}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary flex-fill" type="button" onClick={() => setMemberDraft({ ...member })}>
                        Update
                      </button>
                      <button className="btn btn-sm btn-outline-danger flex-fill" type="button" onClick={() => deleteMember(member.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {taskDraft && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5">{projectTasks.some((task) => task.id === taskDraft.id) ? 'Update Task' : 'Add Task'}</h2>
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
                        {assignedMembers.map((member) => (
                          <option key={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold" htmlFor="taskDueDate">Due Date</label>
                      <input id="taskDueDate" className="form-control" value={taskDraft.dueDate} onChange={(event) => setTaskDraft({ ...taskDraft, dueDate: event.target.value })} />
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
                  <h2 className="modal-title h5">{assignedMembers.some((member) => member.id === memberDraft.id) ? 'Update Member' : 'Assign Member'}</h2>
                  <button type="button" className="btn-close" onClick={() => setMemberDraft(null)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label fw-semibold" htmlFor="memberName">Member</label>
                      <select id="memberName" className="form-select" value={memberDraft.id} onChange={(event) => updateMemberFromSelect(event.target.value)}>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label fw-semibold" htmlFor="memberRole">Role</label>
                      <input id="memberRole" className="form-control" value={memberDraft.role} onChange={(event) => setMemberDraft({ ...memberDraft, role: event.target.value })} />
                    </div>
                    <div>
                      <label className="form-label fw-semibold" htmlFor="assignedDate">Assigned Date</label>
                      <input id="assignedDate" className="form-control" value={memberDraft.assignedDate} onChange={(event) => setMemberDraft({ ...memberDraft, assignedDate: event.target.value })} />
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
