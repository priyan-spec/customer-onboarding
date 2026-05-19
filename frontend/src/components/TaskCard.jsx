import { useState } from 'react'

function priorityClass(priority) {
  if (priority === 'HIGH') return 'badge-soft-red'
  if (priority === 'MEDIUM') return 'badge-soft-amber'
  return 'badge-soft-green'
}

function statusClass(status) {
  if (status === 'DONE') return 'badge-soft-green'
  if (status === 'IN_PROGRESS') return 'badge-soft-blue'
  return 'badge-soft-amber'
}

function TaskCard({ task, interactive = true }) {
  const [status, setStatus] = useState(task.status)

  return (
    <div className="task-card p-3 h-100">
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="h6 fw-bold mb-1">{task.title}</h3>
          <p className="small text-secondary mb-0">{task.project}</p>
        </div>
        <span className={`badge rounded-pill ${priorityClass(task.priority)}`}>{task.priority}</span>
      </div>
      <p className="small text-secondary mb-3">{task.description}</p>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <span className={`badge rounded-pill ${statusClass(status)}`}>{status}</span>
        <span className="badge text-bg-light border">
          <i className="bi bi-calendar2-week me-1" aria-hidden="true"></i>
          {task.dueDate}
        </span>
        <span className="badge text-bg-light border">
          <i className="bi bi-person me-1" aria-hidden="true"></i>
          {task.assignee}
        </span>
      </div>
      {interactive && (
        <div className="d-flex flex-column flex-sm-row gap-2">
          <select className="form-select form-select-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setStatus('IN_PROGRESS')}>
            Start Task
          </button>
          <button className="btn btn-primary btn-sm" type="button" onClick={() => setStatus('DONE')}>
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  )
}

export default TaskCard
