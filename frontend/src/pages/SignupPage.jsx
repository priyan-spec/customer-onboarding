import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { dashboardPathForRole, loginUser, registerUser, setAuthSession } from '../services/api.js'

const roleOptions = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
  { value: 'TEAM_MEMBER', label: 'Team Member' },
]

function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') ?? 'CUSTOMER'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: roleOptions.some((role) => role.value === initialRole) ? initialRole : 'CUSTOMER',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setStatus({ type: 'info', message: 'Creating your account...' })

    try {
      await registerUser(form)
      const response = await loginUser({ email: form.email, password: form.password })
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
            <span className="d-block fw-bold">OnboardFlow</span>
            <span className="small text-secondary">Customer Onboarding Tracker</span>
          </span>
        </div>

        <div className="mb-4">
          <h1 className="h3 fw-bold mb-2">Create account</h1>
          <p className="text-secondary mb-0">Choose your role and set up access to your dashboard.</p>
        </div>

        <form className="vstack gap-3" onSubmit={handleSubmit}>
          <div>
            <label className="form-label fw-semibold" htmlFor="signupName">Name</label>
            <input
              id="signupName"
              className="form-control"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="form-label fw-semibold" htmlFor="signupEmail">Email</label>
            <input
              id="signupEmail"
              className="form-control"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="john@gmail.com"
              required
            />
          </div>

          <div>
            <label className="form-label fw-semibold" htmlFor="signupPassword">Password</label>
            <input
              id="signupPassword"
              className="form-control"
              type="password"
              minLength="6"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div>
            <label className="form-label fw-semibold" htmlFor="signupRole">Role</label>
            <select
              id="signupRole"
              className="form-select"
              value={form.role}
              onChange={(event) => updateField('role', event.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {status.message && (
            <div className={`alert alert-${status.type} mb-0`} role="status">
              {status.message}
            </div>
          )}

          <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
            <i className="bi bi-person-plus me-2" aria-hidden="true"></i>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-4">
          <Link to="/" className="text-decoration-none">
            Back to roles
          </Link>
          <span className="text-secondary">
            Have an account? <Link to={`/login?role=${form.role}`}>Login</Link>
          </span>
        </div>
      </section>
    </main>
  )
}

export default SignupPage
