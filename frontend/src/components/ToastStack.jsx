function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="toast-stack vstack gap-3" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-card p-3">
          <div className="d-flex gap-3">
            <span className="role-icon flex-shrink-0" style={{ width: 40, height: 40, fontSize: 18 }}>
              <i className={`bi ${toast.icon}`} aria-hidden="true"></i>
            </span>
            <div className="flex-grow-1">
              <div className="d-flex align-items-start justify-content-between gap-2">
                <strong className="small">{toast.title}</strong>
                <button className="btn-close" type="button" onClick={() => onDismiss(toast.id)} aria-label="Close"></button>
              </div>
              <p className="small text-secondary mb-0">{toast.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastStack
