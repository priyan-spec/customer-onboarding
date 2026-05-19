import DashboardLayout from '../../components/DashboardLayout.jsx'
import TaskCard from '../../components/TaskCard.jsx'
import { tasks, teamNav } from '../../data/mockData.js'

function MyTasks() {
  return (
    <DashboardLayout
      title="My tasks"
      subtitle="Start work, update status, and mark onboarding tasks complete."
      navItems={teamNav}
      roleLabel="Team Member"
      userName="Aarav Mehta"
    >
      <div className="row g-3">
        {tasks.map((task) => (
          <div className="col-12 col-md-6 col-xxl-4" key={task.id}>
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default MyTasks
