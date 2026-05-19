import { Link, NavLink } from 'react-router-dom'

function Sidebar({ navItems, open, onClose, roleLabel }) {
  return (
    <>
      {open && <button className="sidebar-backdrop border-0 d-lg-none" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="sidebar-brand">
            <span className="brand-mark">
              <i className="bi bi-rocket-takeoff" aria-hidden="true"></i>
            </span>
            <span>
              <span className="d-block fw-bold">OnboardFlow</span>
              <span className="small text-secondary">{roleLabel}</span>
            </span>
          </Link>
          <button className="icon-button d-lg-none" type="button" onClick={onClose} title="Close navigation">
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <nav className="mt-3" aria-label={`${roleLabel} navigation`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="sidebar-link"
              onClick={onClose}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4">
          <div className="app-card p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge badge-soft-blue rounded-pill">Live</span>
              <span className="small fw-semibold text-secondary">Workspace sync</span>
            </div>
            <p className="small text-secondary mb-0">
              Updates are simulated in real time for the frontend preview.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
