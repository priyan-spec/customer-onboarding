import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import { projects, teamNav } from '../../data/mockData.js'

function TeamProjects() {
  return (
    <DashboardLayout
      title="Active projects"
      subtitle="See project context for your assigned onboarding tasks."
      navItems={teamNav}
      roleLabel="Team Member"
      userName="Aarav Mehta"
    >
      <div className="row g-4">
        {projects.filter((project) => project.status === 'Active').map((project) => (
          <div className="col-12 col-md-6 col-xl-4" key={project.id}>
            <ProgressProjectCard project={project} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default TeamProjects
