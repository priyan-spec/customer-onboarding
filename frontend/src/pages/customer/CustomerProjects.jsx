import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import { customerNav } from '../../data/mockData.js'
import { getAuthUser, getCustomerProjects } from '../../services/api.js'

function CustomerProjects() {
  const authUser = getAuthUser()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProjects = useCallback(async () => {
    if (!authUser?.userId) {
      setError('Login again to view your projects.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const customerProjects = await getCustomerProjects(authUser.userId)

      setProjects(customerProjects)
    } catch (loadError) {
      setError(loadError.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [authUser?.userId])

  useEffect(() => {
    let cancelled = false

    async function loadInitialProjects() {
      if (!cancelled) {
        await loadProjects()
      }
    }

    loadInitialProjects()

    return () => {
      cancelled = true
    }
  }, [loadProjects])

  useEffect(() => {
    function handleNotification(event) {
      if (event.detail?.projectId) {
        loadProjects()
      }
    }

    window.addEventListener('onboarding:notification', handleNotification)
    return () => {
      window.removeEventListener('onboarding:notification', handleNotification)
    }
  }, [loadProjects])

  return (
    <DashboardLayout
      title="My Projects"
      subtitle="Review every project and its current progress."
      navItems={customerNav}
      roleLabel="Customer"
      userName="Nina Patel"
    >
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="app-card p-4 text-center text-secondary">
          Loading your projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="app-card p-4 text-center">
          <span className="role-icon mb-3">
            <i className="bi bi-folder-plus" aria-hidden="true"></i>
          </span>
          <h2 className="h5 fw-bold mb-2">No projects yet</h2>
          <p className="text-secondary mb-3">Create an project request to see your projects here.</p>
          <a className="btn btn-primary" href="/customer/create">Create project</a>
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

export default CustomerProjects
