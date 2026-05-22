import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import FileUpload from '../../components/FileUpload.jsx'
import { customerNav } from '../../data/mockData.js'
import { createOnboardingProject } from '../../services/api.js'

function CreateOnboarding() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    priority: 'MEDIUM',
    deadline: '',
  })
  const [documents, setDocuments] = useState([])
  const [uploadKey, setUploadKey] = useState(0)
  const [message, setMessage] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('Submitting project request...')

    try {
      const response = await createOnboardingProject({ ...form, documents })
      setMessage(response.message)
      setForm({
        title: '',
        description: '',
        requirements: '',
        priority: 'MEDIUM',
        deadline: '',
      })
      setDocuments([])
      setUploadKey((value) => value + 1)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <DashboardLayout
      title="Create Project"
      subtitle="Submit a new project request with requirements and documents."
      navItems={customerNav}
      roleLabel="Customer"
      userName="Nina Patel"
    >
      <form className="row g-4" onSubmit={handleSubmit}>
        <div className="col-12 col-xl-8">
          <section className="app-card p-3 p-xl-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="role-icon" style={{ width: 48, height: 48, fontSize: 22 }}>
                <i className="bi bi-kanban" aria-hidden="true"></i>
              </span>
              <div>
                <h2 className="h5 fw-bold mb-1">Project Details</h2>
                <p className="text-secondary mb-0">Define the project scope and timeline.</p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold" htmlFor="projectTitle">Project Title</label>
                <input
                  id="projectTitle"
                  className="form-control"
                  type="text"
                  placeholder="CRM implementation for Acme Retail"
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold" htmlFor="projectDescription">Project Description</label>
                <textarea
                  id="projectDescription"
                  className="form-control"
                  rows="4"
                  placeholder="Describe the business goal, teams involved, and expected project outcome."
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                ></textarea>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  className="form-select"
                  value={form.priority}
                  onChange={(event) => updateField('priority', event.target.value)}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  className="form-control"
                  type="date"
                  value={form.deadline}
                  onChange={(event) => updateField('deadline', event.target.value)}
                />
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
              value={form.requirements}
              onChange={(event) => updateField('requirements', event.target.value)}
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
            <FileUpload key={uploadKey} onFilesSelected={(files) => setDocuments((current) => [...files, ...current])} />
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <div className="app-card p-3 p-xl-4 position-sticky" style={{ top: 98 }}>
            <h2 className="h5 fw-bold mb-3">Submission</h2>
             {/*
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
            */}
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-send me-2" aria-hidden="true"></i>
                Submit
              </button>
            </div>
            {message && (
              <div className="alert alert-info mt-3 mb-0" role="status">
                {message}
              </div>
            )}
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default CreateOnboarding
