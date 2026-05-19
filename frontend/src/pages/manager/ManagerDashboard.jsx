import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import { managerNav, projects, tasks } from '../../data/mockData.js'

function ManagerDashboard() {
  const activeTasks = tasks.filter((task) => task.status !== 'DONE')

  return (
    <DashboardLayout
      title="Project manager dashboard"
      subtitle="Add tasks and assign members for each onboarding project."
      navItems={managerNav}
      roleLabel="Project Manager"
      userName="Maya Singh"
    >
      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Total Active Projects" value="2" icon="bi-kanban" tone="blue" trend="1 in discovery" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Pending Tasks" value="3" icon="bi-hourglass-split" tone="amber" trend="2 due this week" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Completed Tasks" value="8" icon="bi-check2-circle" tone="green" trend="4 closed today" />
        </div>
        <div className="col-12 col-sm-6 col-xxl-3">
          <StatCard label="Projects With Members" value="3" icon="bi-people" tone="cyan" trend="Teams assigned" />
        </div>
      </div>

      <section className="app-card p-3 p-xl-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Assigned projects</h2>
            <p className="text-secondary mb-0">Each project has direct actions to add tasks and add members.</p>
          </div>
        </div>
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
                <tr key={project.id}>
                  <td>
                    <Link className="fw-semibold text-decoration-none text-primary" to={`/manager/project/${project.id}`}>
                      {project.title}
                    </Link>
                  </td>
                  <td>{project.customer}</td>
                  <td style={{ minWidth: 260 }}>
                    <p className="small text-secondary mb-0">{project.requirements}</p>
                  </td>
                  <td style={{ minWidth: 240 }}>
                    <div className="d-flex flex-wrap gap-2">
                      {project.documents.map((document) => (
                        <span className="badge text-bg-light border fw-normal" key={document.name}>
                          <i className="bi bi-file-earmark-text me-1 text-primary" aria-hidden="true"></i>
                          {document.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{project.dueDate}</td>
                  <td style={{ minWidth: 180 }}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>{project.phase}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress" role="progressbar" aria-label={`${project.title} progress`} aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">
                      <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${project.status === 'Completed' ? 'badge-soft-green' : 'badge-soft-blue'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <Link className="btn btn-sm btn-outline-primary" to={`/manager/project/${project.id}#tasks`}>
                        <i className="bi bi-list-check me-1" aria-hidden="true"></i>
                        Add Task
                      </Link>
                      <Link className="btn btn-sm btn-primary" to={`/manager/project/${project.id}#members`}>
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
              {activeTasks.map((task) => (
                <tr key={task.id}>
                  <td className="fw-semibold">{task.title}</td>
                  <td>{task.project}</td>
                  <td>{task.assignee}</td>
                  <td><span className="badge badge-soft-amber rounded-pill">{task.priority}</span></td>
                  <td><span className="badge badge-soft-blue rounded-pill">{task.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default ManagerDashboard
