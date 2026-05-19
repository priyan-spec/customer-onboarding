import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import TaskCard from '../../components/TaskCard.jsx'
import { teamNav } from '../../data/mockData.js'
import { getAuthUser, getTasksByAssignee, updateTask } from '../../services/api.js'

function MyTasks() {
  const authUser = getAuthUser()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    if (!authUser?.userId) {
      setError('Login again to view your tasks.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      setTasks(await getTasksByAssignee(authUser.userId))
    } catch (loadError) {
      setError(loadError.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [authUser?.userId])

  useEffect(() => {
    let cancelled = false

    async function loadInitialTasks() {
      if (!authUser?.userId) {
        setError('Login again to view your tasks.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const assignedTasks = await getTasksByAssignee(authUser.userId)

        if (!cancelled) {
          setTasks(assignedTasks)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
          setTasks([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialTasks()

    return () => {
      cancelled = true
    }
  }, [authUser?.userId])

  async function handleStatusChange(task, status) {
    try {
      await updateTask(task.taskId, { status })
      setMessage('Task status updated.')
      await loadTasks()
    } catch (updateError) {
      setMessage(updateError.message)
      await loadTasks()
    }
  }

  return (
    <DashboardLayout
      title="My tasks"
      subtitle="Start work, update status, and mark onboarding tasks complete."
      navItems={teamNav}
      roleLabel="Team Member"
      userName="Aarav Mehta"
    >
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-info" role="status">{message}</div>}

      {loading ? (
        <div className="app-card p-4 text-center text-secondary">Loading your tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="app-card p-4 text-center">
          <span className="role-icon mb-3">
            <i className="bi bi-check2-square" aria-hidden="true"></i>
          </span>
          <h2 className="h5 fw-bold mb-2">No assigned tasks</h2>
          <p className="text-secondary mb-0">Tasks assigned by your project manager will appear here.</p>
        </div>
      ) : (
        <div className="row g-3">
          {tasks.map((task) => (
            <div className="col-12 col-md-6 col-xxl-4" key={task.taskId}>
              <TaskCard task={task} interactive={task.status !== 'DONE'} onStatusChange={handleStatusChange} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default MyTasks
