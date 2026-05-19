import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import StatCard from '../../components/StatCard.jsx'
import { customerNav, projects } from '../../data/mockData.js'

function CustomerDashboard() {
  const activeProjects = projects.filter((project) => project.status === 'Active')

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
          <StatCard label="Total Projects" value="3" icon="bi-folder2-open" tone="blue" trend="1 new this week" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Active Projects" value="2" icon="bi-lightning-charge" tone="cyan" trend="On schedule" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Completed Projects" value="1" icon="bi-check2-circle" tone="green" trend="Handoff complete" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Pending Tasks" value="6" icon="bi-hourglass-split" tone="amber" trend="2 due soon" />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0">Project progress</h2>
        <span className="badge badge-soft-blue rounded-pill">Customer view</span>
      </div>
      <div className="row g-3 mb-4">
        {activeProjects.map((project) => (
          <div className="col-12 col-lg-6 col-xxl-4" key={project.id}>
            <ProgressProjectCard project={project} />
          </div>
        ))}
      </div>

      <div className="app-card p-3 p-xl-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 fw-bold mb-0">Recent updates</h2>
          <span className="small text-secondary">Project status</span>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Project</th>
                <th>Update</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="fw-semibold">{project.title}</td>
                  <td className="text-secondary">{project.phase}</td>
                  <td>
                    <span className={`badge rounded-pill ${project.status === 'Completed' ? 'badge-soft-green' : 'badge-soft-blue'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{project.owner}</td>
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
