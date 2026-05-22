import { Link } from 'react-router-dom'
import { roleCards } from '../data/mockData.js'
import { dashboardPathForRole, getAuthUser } from '../services/api.js'

function RoleSelection() {
  const authUser = getAuthUser()

  return (
    <main className="role-page">
      <section className="role-panel text-center">
        <div className="d-flex justify-content-end gap-2 mb-4">
          <Link to="/login" className="btn btn-outline-primary">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>

        <div className="mb-5">
          <span className="brand-mark mx-auto mb-4">
            <i className="bi bi-rocket-takeoff" aria-hidden="true"></i>
          </span>
          <h1 className="display-5 fw-bold mb-3">Project Status Tracker</h1>
          <p className="lead text-secondary mb-0">Select your role to continue</p>
        </div>

        <div className="row g-4 justify-content-center">
          {roleCards.map((role) => (
            <div className="col-12 col-md-6 col-xl-4" key={role.title}>
              <Link
                to={authUser ? dashboardPathForRole(authUser.role) : `/login?role=${role.role}`}
                className="text-decoration-none text-reset"
              >
                <article className="role-card card h-100">
                  <div className="card-body p-4 p-xl-5 d-flex flex-column align-items-center justify-content-center">
                    <span className="role-icon mb-4">
                      <i className={`bi ${role.icon}`} aria-hidden="true"></i>
                    </span>
                    <h2 className="h4 fw-bold mb-3">{role.title}</h2>
                    <p className="text-secondary mb-4">{role.description}</p>
                    <span className="btn btn-outline-primary">
                      Continue
                      <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
                    </span>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default RoleSelection
