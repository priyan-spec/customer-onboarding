import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressProjectCard from '../../components/ProgressProjectCard.jsx'
import { customerNav, projects } from '../../data/mockData.js'

function CustomerProjects() {
  return (
    <DashboardLayout
      title="My projects"
      subtitle="Review every onboarding project and its current progress."
      navItems={customerNav}
      roleLabel="Customer"
      userName="Nina Patel"
    >
      <div className="row g-4">
        {projects.map((project) => (
          <div className="col-12 col-md-6 col-xl-4" key={project.id}>
            <ProgressProjectCard project={project} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default CustomerProjects
