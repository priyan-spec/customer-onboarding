import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clearAuthToken } from '../services/api.js'

function AppNavbar({ title, subtitle, userName, roleLabel, notifications, onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="topbar">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <button className="icon-button d-lg-none" type="button" onClick={onMenuClick} title="Open navigation">
            <i className="bi bi-list" aria-hidden="true"></i>
          </button>
          <div>
            <h1 className="h4 fw-bold mb-1">{title}</h1>
            <p className="text-secondary mb-0 small">{subtitle}</p>
          </div>
        </div>


        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <button
              className="icon-button position-relative"
              type="button"
              onClick={() => setShowNotifications((value) => !value)}
              title="Notifications"
            >
              <i className="bi bi-bell" aria-hidden="true"></i>
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-menu p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h6 fw-bold mb-0">Notifications</h2>
                  <span className="badge badge-soft-blue rounded-pill">Live</span>
                </div>
                <div className="notification-list vstack gap-3">
                  {notifications.length === 0 && (
                    <div className="text-center text-secondary small py-3">No notifications yet.</div>
                  )}
                  {notifications.map((item) => (
                    <div key={item.id} className="d-flex gap-3">
                      <span className="role-icon flex-shrink-0" style={{ width: 38, height: 38, fontSize: 18 }}>
                        <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                      </span>
                      <span>
                        <span className="d-block fw-semibold small">{item.title}</span>
                        <span className="d-block text-secondary small">{item.message}</span>
                        <span className="d-block text-secondary small">{item.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="d-flex align-items-center gap-2 ps-1">
            <span className="avatar">{userName.split(' ').map((part) => part[0]).join('')}</span>
            <span className="d-none d-sm-block text-start">
              <span className="d-block fw-semibold small">{userName}</span>
              <span className="d-block text-secondary small">{roleLabel}</span>
            </span>
          </div>

          <Link
            to="/login"
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2"
            onClick={clearAuthToken}
          >
            <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
            <span className="d-none d-md-inline">Logout</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default AppNavbar
