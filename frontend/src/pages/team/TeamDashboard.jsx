import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import StatCard from '../../components/StatCard.jsx'
import TaskCard from '../../components/TaskCard.jsx'
import { projects, tasks, teamNav } from '../../data/mockData.js'

function TeamDashboard() {
  const assignedTasks = tasks.filter((task) => task.assignee === 'Aarav Mehta' || task.status !== 'DONE').slice(0, 3)

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
          <StatCard label="Assigned Tasks" value="7" icon="bi-list-check" tone="blue" trend="3 high priority" />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard label="Completed Tasks" value="4" icon="bi-check2-circle" tone="green" trend="2 completed today" />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard label="Pending Tasks" value="3" icon="bi-hourglass-split" tone="amber" trend="1 due tomorrow" />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0">My tasks</h2>
        <span className="badge badge-soft-blue rounded-pill">Status editable</span>
      </div>
      <div className="row g-3 mb-4">
        {assignedTasks.map((task) => (
          <div className="col-12 col-lg-6 col-xxl-4" key={task.id}>
            <TaskCard task={task} />
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0">Active projects</h2>
        <span className="small text-secondary">2 in progress</span>
      </div>
      <div className="row g-3">
        {projects.filter((project) => project.status === 'Active').map((project) => (
          <div className="col-12 col-lg-6 col-xxl-4" key={project.id}>
            <ProgressProjectCard project={project} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default TeamDashboard
