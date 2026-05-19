import DashboardLayout from '../../components/DashboardLayout.jsx'
import FileUpload from '../../components/FileUpload.jsx'
import { customerNav } from '../../data/mockData.js'

function CreateOnboarding() {
  return (
    <DashboardLayout
      title="Create onboarding"
      subtitle="Submit a new onboarding request with requirements and documents."
      navItems={customerNav}
      roleLabel="Customer"
      userName="Nina Patel"
    >
      <form className="row g-4">
        <div className="col-12 col-xl-8">
          <section className="app-card p-3 p-xl-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="role-icon" style={{ width: 48, height: 48, fontSize: 22 }}>
                <i className="bi bi-kanban" aria-hidden="true"></i>
              </span>
              <div>
                <h2 className="h5 fw-bold mb-1">Project Details</h2>
                <p className="text-secondary mb-0">Define the onboarding scope and timeline.</p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold" htmlFor="projectTitle">Project Title</label>
                <input id="projectTitle" className="form-control" type="text" placeholder="CRM implementation for Acme Retail" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold" htmlFor="projectDescription">Project Description</label>
                <textarea id="projectDescription" className="form-control" rows="4" placeholder="Describe the business goal, teams involved, and expected onboarding outcome."></textarea>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" htmlFor="priority">Priority</label>
                <select id="priority" className="form-select" defaultValue="MEDIUM">
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" htmlFor="dueDate">Due Date</label>
                <input id="dueDate" className="form-control" type="date" />
              </div>
            </div>
          </section>

          <section className="app-card p-3 p-xl-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="role-icon" style={{ width: 48, height: 48, fontSize: 22 }}>
                <i className="bi bi-card-checklist" aria-hidden="true"></i>
              </span>
              <div>
                <h2 className="h5 fw-bold mb-1">Requirements</h2>
                <p className="text-secondary mb-0">Share the exact workflow and integrations needed.</p>
              </div>
            </div>
            <label className="form-label fw-semibold" htmlFor="requirements">Requirements Text</label>
            <textarea
              id="requirements"
              className="form-control"
              rows="7"
              placeholder="Need CRM setup, dashboard integration and document verification workflow"
            ></textarea>
          </section>

          <section className="app-card p-3 p-xl-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="role-icon" style={{ width: 48, height: 48, fontSize: 22 }}>
                <i className="bi bi-cloud-arrow-up" aria-hidden="true"></i>
              </span>
              <div>
                <h2 className="h5 fw-bold mb-1">Document Upload</h2>
                <p className="text-secondary mb-0">Upload ID Proof, Business Certificate, Address Proof, or Other documents.</p>
              </div>
            </div>
            <FileUpload />
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <div className="app-card p-3 p-xl-4 position-sticky" style={{ top: 98 }}>
            <h2 className="h5 fw-bold mb-3">Submission summary</h2>
            <div className="vstack gap-3 mb-4">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Request type</span>
                <span className="fw-semibold">Customer onboarding</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Document types</span>
                <span className="fw-semibold">4 supported</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Review SLA</span>
                <span className="fw-semibold">2 business days</span>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="button">
                <i className="bi bi-send me-2" aria-hidden="true"></i>
                Submit Onboarding
              </button>
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-save me-2" aria-hidden="true"></i>
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default CreateOnboarding
