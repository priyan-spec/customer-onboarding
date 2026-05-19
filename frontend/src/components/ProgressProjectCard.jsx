import { Link } from 'react-router-dom'

function priorityBadge(priority) {
  if (priority === 'HIGH') return 'badge-soft-red'
  if (priority === 'MEDIUM') return 'badge-soft-amber'
  return 'badge-soft-green'
}

function ProgressProjectCard({ project, linkTo }) {
  const content = (
    <div className="project-card p-3 h-100">
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="h6 fw-bold mb-1">{project.title}</h3>
          <p className="small text-secondary mb-0">{project.customer}</p>
        </div>
        <span className={`badge rounded-pill ${priorityBadge(project.priority)}`}>{project.priority}</span>
      </div>
      <p className="small text-secondary mb-3">{project.description}</p>
      <div className="d-flex align-items-center justify-content-between small mb-2">
        <span className="fw-semibold">{project.phase}</span>
        <span className="text-secondary">{project.progress}%</span>
      </div>
      <div className="progress" role="progressbar" aria-label={`${project.title} progress`} aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${project.progress}%` }}></div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-3 small text-secondary">
        <span>
          <i className="bi bi-calendar2-week me-1" aria-hidden="true"></i>
          {project.dueDate}
        </span>
        <span>{project.owner}</span>
      </div>
    </div>
  )

  if (!linkTo) {
    return content
  }

  return (
    <Link to={linkTo} className="text-decoration-none text-reset">
      {content}
    </Link>
  )
}

export default ProgressProjectCard
