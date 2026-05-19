function StatCard({ label, value, icon, tone = 'blue', trend }) {
  return (
    <div className="stat-card p-3 p-xl-4">
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div>
          <p className="text-secondary small mb-2">{label}</p>
          <div className="h3 fw-bold mb-0">{value}</div>
        </div>
        <span className={`stat-icon ${tone}`}>
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </span>
      </div>
      {trend && (
        <div className="small text-secondary mt-3">
          <i className="bi bi-arrow-up-short text-success" aria-hidden="true"></i>
          {trend}
        </div>
      )}
    </div>
  )
}

export default StatCard
