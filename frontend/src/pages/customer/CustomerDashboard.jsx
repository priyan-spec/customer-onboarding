import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import StatCard from '../../components/StatCard.jsx'
import { customerNav } from '../../data/mockData.js'
import { getAuthUser, getCustomerProjects, getTasksByProject } from '../../services/api.js'

function CustomerDashboard() {
  const authUser = getAuthUser()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      if (!authUser?.userId) {
        setError('Login again to view your projects.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const customerProjects = await getCustomerProjects(authUser.userId)
        const projectTasks = await Promise.all(
          customerProjects.map((project) => getTasksByProject(project.projectId).catch(() => [])),
        )

        if (!cancelled) {
          setProjects(customerProjects)
          setTasks(projectTasks.flat())
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
          setProjects([])
          setTasks([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      cancelled = true
    }
  }, [authUser?.userId])

  const stats = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status === 'ACTIVE')
    const completedProjects = projects.filter((project) => project.status === 'COMPLETED')
    const pendingTasks = tasks.filter((task) => task.status !== 'DONE')

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      pendingTasks: pendingTasks.length,
    }
  }, [projects, tasks])

  return (
    <DashboardLayout
      title="Customer dashboard"
      subtitle="Track onboarding progress and pending work in one place."
      navItems={customerNav}
      roleLabel="Customer"
      userName="Nina Patel"
    >
      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Total Projects" value={stats.totalProjects} icon="bi-folder2-open" tone="blue" trend="Your submitted projects" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Active Projects" value={stats.activeProjects} icon="bi-lightning-charge" tone="cyan" trend="Currently in progress" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Completed Projects" value={stats.completedProjects} icon="bi-check2-circle" tone="green" trend="Handoff complete" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Pending Tasks" value={stats.pendingTasks} icon="bi-hourglass-split" tone="amber" trend="Across your projects" />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0">Your projects</h2>
        <span className="badge badge-soft-blue rounded-pill">Customer view</span>
      </div>

      {loading ? (
        <div className="app-card p-4 mb-4 text-center text-secondary">
          Loading your projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="app-card p-4 mb-4 text-center">
          <span className="role-icon mb-3">
            <i className="bi bi-folder-plus" aria-hidden="true"></i>
          </span>
          <h3 className="h5 fw-bold mb-2">No projects yet</h3>
          <p className="text-secondary mb-3">Create your first onboarding request to see it here.</p>
          <a className="btn btn-primary" href="/customer/create">Create Onboarding</a>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {projects.map((project) => (
            <div className="col-12 col-lg-6 col-xxl-4" key={project.projectId}>
              <ProgressProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      <div className="app-card p-3 p-xl-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 fw-bold mb-0">Project status</h2>
          <span className="small text-secondary">Project status</span>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Project</th>
                <th>Requirements</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.projectId}>
                  <td className="fw-semibold">{project.title}</td>
                  <td className="text-secondary">{project.requirements}</td>
                  <td>{project.deadline}</td>
                  <td>
                    <span className={`badge rounded-pill ${project.status === 'COMPLETED' ? 'badge-soft-green' : 'badge-soft-blue'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{project.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CustomerDashboard
