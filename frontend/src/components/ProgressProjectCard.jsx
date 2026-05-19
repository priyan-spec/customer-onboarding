import { Link } from 'react-router-dom'

function priorityBadge(priority) {
  if (priority === 'HIGH') return 'badge-soft-red'
  if (priority === 'MEDIUM') return 'badge-soft-amber'
  return 'badge-soft-green'
}

function ProgressProjectCard({ project, linkTo }) {
  const title = project.title
  const customer = project.customer ?? project.customerName ?? 'Customer project'
  const description = project.description ?? project.requirements ?? 'Onboarding project'
  const phase = project.phase ?? project.status ?? 'ACTIVE'
  const progress = project.progress ?? 0
  const dueDate = project.dueDate ?? project.deadline ?? 'No deadline'
  const owner = project.owner ?? project.managerName ?? ''

  const content = (
    <div className="project-card p-3 h-100">
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="h6 fw-bold mb-1">{title}</h3>
          <p className="small text-secondary mb-0">{customer}</p>
        </div>
        <span className={`badge rounded-pill ${priorityBadge(project.priority)}`}>{project.priority}</span>
      </div>
      <p className="small text-secondary mb-3">{description}</p>
      <div className="d-flex align-items-center justify-content-between small mb-2">
        <span className="fw-semibold">{phase}</span>
        <span className="text-secondary">{progress}%</span>
      </div>
      <div className="progress" role="progressbar" aria-label={`${title} progress`} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-3 small text-secondary">
        <span>
          <i className="bi bi-calendar2-week me-1" aria-hidden="true"></i>
          {dueDate}
        </span>
        {owner && <span>{owner}</span>}
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
