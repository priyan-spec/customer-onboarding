import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import { managerNav } from '../../data/mockData.js'
import { getAuthUser, getManagerProjects, getTasksByProject } from '../../services/api.js'

function ManagerDashboard() {
  const authUser = getAuthUser()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadManagerWork = useCallback(async () => {
    if (!authUser?.userId) {
      setError('Login again to view assigned projects.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const managerProjects = await getManagerProjects(authUser.userId)
      const projectTasks = await Promise.all(
        managerProjects.map((project) => getTasksByProject(project.projectId).catch(() => [])),
      )

      setProjects(managerProjects)
      setTasks(projectTasks.flat())
    } catch (loadError) {
      setError(loadError.message)
      setProjects([])
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [authUser?.userId])

  useEffect(() => {
    let cancelled = false

    async function loadInitialManagerWork() {
      if (!cancelled) {
        await loadManagerWork()
      }
    }

    loadInitialManagerWork()

    return () => {
      cancelled = true
    }
  }, [loadManagerWork])

  useEffect(() => {
    function handleNotification(event) {
      if (event.detail?.projectId || event.detail?.taskId) {
        loadManagerWork()
      }
    }

    window.addEventListener('onboarding:notification', handleNotification)
    return () => {
      window.removeEventListener('onboarding:notification', handleNotification)
    }
  }, [loadManagerWork])

  const stats = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status === 'ACTIVE')
    const pendingTasks = tasks.filter((task) => task.status !== 'DONE')
    const completedTasks = tasks.filter((task) => task.status === 'DONE')

    return {
      activeProjects: activeProjects.length,
      pendingTasks: pendingTasks.length,
      completedTasks: completedTasks.length,
      projectsWithMembers: projects.length,
    }
  }, [projects, tasks])

  return (
    <DashboardLayout
      title="Project manager dashboard"
      subtitle="Add tasks and assign members for each project."
      navItems={managerNav}
      roleLabel="Project Manager"
      userName="Maya Singh"
    >
      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Total Active Projects" value={stats.activeProjects} icon="bi-kanban" tone="blue" trend="Assigned to you" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Pending Tasks" value={stats.pendingTasks} icon="bi-hourglass-split" tone="amber" trend="Across assigned projects" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Completed Tasks" value={stats.completedTasks} icon="bi-check2-circle" tone="green" trend="Closed tasks" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Assigned Projects" value={stats.projectsWithMembers} icon="bi-people" tone="cyan" trend="Ready for staffing" />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <section className="app-card p-3 p-xl-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Assigned projects</h2>
            <p className="text-secondary mb-0">Projects automatically assigned to you by least-loaded manager logic.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-secondary p-4">Loading assigned projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center p-4">
            <span className="role-icon mb-3">
              <i className="bi bi-kanban" aria-hidden="true"></i>
            </span>
            <h3 className="h5 fw-bold mb-2">No assigned projects yet</h3>
            <p className="text-secondary mb-0">New customer project requests assigned to you will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Customer</th>
                  <th>Requirements</th>
                  <th>Documents</th>
                  <th>Due date</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Project actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.projectId}>
                    <td>
                      <Link className="fw-semibold text-decoration-none text-primary" to={`/manager/project/${project.projectId}`}>
                        {project.title}
                      </Link>
                    </td>
                    <td>{project.customerName}</td>
                    <td style={{ minWidth: 260 }}>
                      <p className="small text-secondary mb-0">{project.requirements}</p>
                    </td>
                    <td style={{ minWidth: 240 }}>
                      <div className="d-flex flex-wrap gap-2">
                        {(project.documents ?? []).map((document) => (
                          <span className="badge text-bg-light border fw-normal" key={document.id}>
                            <i className="bi bi-file-earmark-text me-1 text-primary" aria-hidden="true"></i>
                            {document.fileName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{project.deadline}</td>
                    <td style={{ minWidth: 180 }}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{project.status}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="progress" role="progressbar" aria-label={`${project.title} progress`} aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${project.status === 'COMPLETED' ? 'badge-soft-green' : 'badge-soft-blue'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <Link className="btn btn-sm btn-outline-primary" to={`/manager/project/${project.projectId}#tasks`}>
                          <i className="bi bi-list-check me-1" aria-hidden="true"></i>
                          Add Task
                        </Link>
                        <Link className="btn btn-sm btn-primary" to={`/manager/project/${project.projectId}#members`}>
                          <i className="bi bi-person-plus me-1" aria-hidden="true"></i>
                          Assign Members
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="app-card p-3 p-xl-4">
        <h2 className="h5 fw-bold mb-3">Active tasks</h2>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.filter((task) => task.status !== 'DONE').map((task) => (
                <tr key={task.taskId}>
                  <td className="fw-semibold">{task.title}</td>
                  <td>{task.projectTitle}</td>
                  <td>{task.assigneeName ?? 'Unassigned'}</td>
                  <td><span className="badge badge-soft-amber rounded-pill">{task.priority}</span></td>
                  <td><span className="badge badge-soft-blue rounded-pill">{task.status}</span></td>
                </tr>
              ))}
              {!loading && tasks.filter((task) => task.status !== 'DONE').length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-secondary">No active tasks yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default ManagerDashboard
