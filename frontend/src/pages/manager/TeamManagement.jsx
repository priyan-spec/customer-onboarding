import DashboardLayout from '../../components/DashboardLayout.jsx'
import EmployeeAssignment from '../../components/EmployeeAssignment.jsx'
import { managerNav, teamMembers } from '../../data/mockData.js'

function TeamManagement() {
  return (
    <DashboardLayout
      title="Team management"
      subtitle="Monitor utilization and assign employees to project tasks."
      navItems={managerNav}
      roleLabel="Project Manager"
      userName="Maya Singh"
    >
      <div className="row g-4 mb-4">
        {teamMembers.map((member) => (
          <div className="col-12 col-md-6 col-xl-3" key={member.id}>
            <div className="member-card p-3 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="avatar lg">{member.avatar}</span>
                <div>
                  <h2 className="h6 fw-bold mb-1">{member.name}</h2>
                  <p className="small text-secondary mb-0">{member.role}</p>
                </div>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span>Utilization</span>
                <span>{member.workload}%</span>
              </div>
              <div className="progress" role="progressbar" aria-label={`${member.name} utilization`} aria-valuenow={member.workload} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{ width: `${member.workload}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <EmployeeAssignment />
    </DashboardLayout>
  )
}

export default TeamManagement
