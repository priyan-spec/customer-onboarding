import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import { teamNav } from '../../data/mockData.js'
import { getAuthUser, getProject, getTasksByAssignee } from '../../services/api.js'

function uniqueProjectIds(tasks) {
  return [...new Set(tasks.map((task) => task.projectId).filter(Boolean))]
}

function TeamProjects() {
  const authUser = getAuthUser()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadInitialProjects() {
      if (!authUser?.userId) {
        setError('Login again to view active projects.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const tasks = await getTasksByAssignee(authUser.userId)
        const activeProjects = await Promise.all(
          uniqueProjectIds(tasks).map((projectId) => getProject(projectId).catch(() => null)),
        )

        if (!cancelled) {
          setProjects(activeProjects.filter(Boolean))
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
          setProjects([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialProjects()

    return () => {
      cancelled = true
    }
  }, [authUser?.userId])

  return (
    <DashboardLayout
      title="Active projects"
      subtitle="See project context for your assigned onboarding tasks."
      navItems={teamNav}
      roleLabel="Team Member"
      userName="Aarav Mehta"
    >
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading ? (
        <div className="app-card p-4 text-center text-secondary">Loading active projects...</div>
      ) : projects.length === 0 ? (
        <div className="app-card p-4 text-center">
          <span className="role-icon mb-3">
            <i className="bi bi-folder-check" aria-hidden="true"></i>
          </span>
          <h2 className="h5 fw-bold mb-2">No active projects</h2>
          <p className="text-secondary mb-0">Project context appears here when tasks are assigned to you.</p>
        </div>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div className="col-12 col-md-6 col-xl-4" key={project.projectId}>
              <ProgressProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default TeamProjects
