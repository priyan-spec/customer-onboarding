import { useCallback, useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import StatCard from '../../components/StatCard.jsx'
import TaskCard from '../../components/TaskCard.jsx'
import { teamNav } from '../../data/mockData.js'
import { getAuthUser, getProject, getTasksByAssignee, updateTask } from '../../services/api.js'

function uniqueProjectIds(tasks) {
  return [...new Set(tasks.map((task) => task.projectId).filter(Boolean))]
}

function TeamDashboard() {
  const authUser = getAuthUser()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadTeamWork = useCallback(async () => {
    if (!authUser?.userId) {
      setError('Login again to view your work.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const assignedTasks = await getTasksByAssignee(authUser.userId)
      const activeProjects = await Promise.all(
        uniqueProjectIds(assignedTasks).map((projectId) => getProject(projectId).catch(() => null)),
      )

      setTasks(assignedTasks)
      setProjects(activeProjects.filter(Boolean))
    } catch (loadError) {
      setError(loadError.message)
      setTasks([])
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [authUser?.userId])

  useEffect(() => {
    let cancelled = false

    async function loadInitialTeamWork() {
      if (!authUser?.userId) {
        setError('Login again to view your work.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const assignedTasks = await getTasksByAssignee(authUser.userId)
        const activeProjects = await Promise.all(
          uniqueProjectIds(assignedTasks).map((projectId) => getProject(projectId).catch(() => null)),
        )

        if (!cancelled) {
          setTasks(assignedTasks)
          setProjects(activeProjects.filter(Boolean))
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
          setTasks([])
          setProjects([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialTeamWork()

    return () => {
      cancelled = true
    }
  }, [authUser?.userId])

  const stats = useMemo(() => ({
    assigned: tasks.length,
    completed: tasks.filter((task) => task.status === 'DONE').length,
    pending: tasks.filter((task) => task.status !== 'DONE').length,
  }), [tasks])

  async function handleStatusChange(task, status) {
    try {
      await updateTask(task.taskId, { status })
      setMessage('Task status updated.')
      await loadTeamWork()
    } catch (updateError) {
      setMessage(updateError.message)
      await loadTeamWork()
    }
  }

  return (
    <DashboardLayout
      title="Team member dashboard"
      subtitle="View assigned tasks, active projects, and work updates."
      navItems={teamNav}
      roleLabel="Team Member"
      userName="Aarav Mehta"
    >
      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard label="Assigned Tasks" value={stats.assigned} icon="bi-list-check" tone="blue" trend="Assigned to you" />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard label="Completed Tasks" value={stats.completed} icon="bi-check2-circle" tone="green" trend="Marked done" />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard label="Pending Tasks" value={stats.pending} icon="bi-hourglass-split" tone="amber" trend="Still open" />
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-info" role="status">{message}</div>}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0">My tasks</h2>
        <span className="badge badge-soft-blue rounded-pill">Status editable</span>
      </div>

      {loading ? (
        <div className="app-card p-4 mb-4 text-center text-secondary">Loading your work...</div>
      ) : tasks.length === 0 ? (
        <div className="app-card p-4 mb-4 text-center">
          <span className="role-icon mb-3">
            <i className="bi bi-check2-square" aria-hidden="true"></i>
          </span>
          <h3 className="h5 fw-bold mb-2">No assigned tasks</h3>
          <p className="text-secondary mb-0">Assigned tasks will appear once your manager creates them.</p>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {tasks.slice(0, 3).map((task) => (
            <div className="col-12 col-lg-6 col-xxl-4" key={task.taskId}>
              <TaskCard task={task} interactive={task.status !== 'DONE'} onStatusChange={handleStatusChange} />
            </div>
          ))}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0">Active projects</h2>
        <span className="small text-secondary">{projects.length} assigned</span>
      </div>
      <div className="row g-3">
        {projects.map((project) => (
          <div className="col-12 col-lg-6 col-xxl-4" key={project.projectId}>
            <ProgressProjectCard project={project} />
          </div>
        ))}
        {!loading && projects.length === 0 && (
          <div className="col-12">
            <div className="app-card p-4 text-center text-secondary">No active project context yet.</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TeamDashboard
