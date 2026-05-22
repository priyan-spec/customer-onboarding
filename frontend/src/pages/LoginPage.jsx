import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { dashboardPathForRole, loginUser, setAuthSession } from '../services/api.js'

const roleLabels = {
  CUSTOMER: 'Customer',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_MEMBER: 'Team Member',
}

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleHint = searchParams.get('role')
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setStatus({ type: 'info', message: 'Signing you in...' })

    try {
      const response = await loginUser(form)
      setAuthSession(response)
      navigate(dashboardPathForRole(response.role), { replace: true })
    } catch (error) {
      setStatus({ type: 'danger', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand mb-4">
          <span className="brand-mark">
            <i className="bi bi-rocket-takeoff" aria-hidden="true"></i>
          </span>
          <span>
            <span className="d-block fw-bold">ProjectFlow</span>
            <span className="small text-secondary">Project Status Tracker</span>
          </span>
        </div>

        <div className="mb-4">
          <h1 className="h3 fw-bold mb-2">Login</h1>
          <p className="text-secondary mb-0">
            {roleHint ? `Continue as ${roleLabels[roleHint] ?? 'your selected role'}.` : 'Use your account to continue.'}
          </p>
        </div>

        <form className="vstack gap-3" onSubmit={handleSubmit}>
          <div>
            <label className="form-label fw-semibold" htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              className="form-control"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="john@gmail.com"
              required
            />
          </div>

          <div>
            <label className="form-label fw-semibold" htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              className="form-control"
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {status.message && (
            <div className={`alert alert-${status.type} mb-0`} role="status">
              {status.message}
            </div>
          )}

          <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
            <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-4">
          <Link to="/" className="text-decoration-none">
            Back to roles
          </Link>
          <span className="text-secondary">
            New here? <Link to={`/signup${roleHint ? `?role=${roleHint}` : ''}`}>Create account</Link>
          </span>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
