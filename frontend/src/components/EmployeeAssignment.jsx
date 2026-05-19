import { useState } from 'react'
import { projects, teamMembers } from '../data/mockData.js'

function EmployeeAssignment() {
  const [selectedIds, setSelectedIds] = useState([1, 2])
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id)
  const [modalOpen, setModalOpen] = useState(false)

  const assignedMembers = teamMembers.filter((member) => selectedIds.includes(member.id))
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0]

  function handleMultiSelect(event) {
    const values = Array.from(event.target.selectedOptions).map((option) => Number(option.value))
    setSelectedIds(values)
  }

  function toggleMember(id) {
    setSelectedIds((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]))
  }

  return (
    <>
      <div className="app-card p-3 p-xl-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h5 fw-bold mb-1">Team assignment</h2>
            <p className="text-secondary mb-0">Choose a project, then add members to that project.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => setModalOpen(true)}>
            <i className="bi bi-person-plus me-2" aria-hidden="true"></i>
            Assignment modal
          </button>
        </div>

        <label className="form-label fw-semibold" htmlFor="projectSelect">Project</label>
        <select
          id="projectSelect"
          className="form-select mb-3"
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        <label className="form-label fw-semibold" htmlFor="employeeSelect">Multi-select employees</label>
        <select id="employeeSelect" className="form-select mb-3" multiple value={selectedIds.map(String)} onChange={handleMultiSelect}>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} - {member.role}
            </option>
          ))}
        </select>

        <div className="d-flex flex-wrap gap-2 mb-4">
          <span className="badge rounded-pill badge-soft-green py-2 px-3">
            Project: {selectedProject.title}
          </span>
          {assignedMembers.map((member) => (
            <span className="badge rounded-pill badge-soft-blue py-2 px-3" key={member.id}>
              {member.name}
            </span>
          ))}
        </div>

        <div className="row g-3">
          {assignedMembers.map((member) => (
            <div className="col-12 col-md-6 col-xl-3" key={member.id}>
              <div className="member-card p-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="avatar lg">{member.avatar}</span>
                  <div>
                    <h3 className="h6 fw-bold mb-1">{member.name}</h3>
                    <p className="small text-secondary mb-0">{member.role}</p>
                  </div>
                </div>
                <p className="small text-secondary mb-2">Assigned date</p>
                <p className="fw-semibold mb-3">{member.assignedDate}</p>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Workload</span>
                  <span>{member.workload}%</span>
                </div>
                <div className="progress" role="progressbar" aria-label={`${member.name} workload`} aria-valuenow={member.workload} aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar" style={{ width: `${member.workload}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5">Assign members to {selectedProject.title}</h2>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="vstack gap-3">
                    {teamMembers.map((member) => (
                      <label className="d-flex align-items-center gap-3 border rounded p-3" key={member.id}>
                        <input
                          className="form-check-input m-0"
                          type="checkbox"
                          checked={selectedIds.includes(member.id)}
                          onChange={() => toggleMember(member.id)}
                        />
                        <span className="avatar">{member.avatar}</span>
                        <span>
                          <span className="d-block fw-semibold">{member.name}</span>
                          <span className="d-block small text-secondary">{member.role}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setModalOpen(false)}>
                    Assign members
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  )
}

export default EmployeeAssignment
