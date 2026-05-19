function ActivityTimeline({ items, title = 'Activity timeline', live = false }) {
  return (
    <div className={`app-card p-3 p-xl-4 h-100 ${live ? 'live-panel' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0">{title}</h2>
        {live && <span className="badge badge-soft-blue rounded-pill">Live</span>}
      </div>
      <div className="timeline">
        {items.map((item) => (
          <div className="timeline-item" key={`${item.title}-${item.time}`}>
            <span className="timeline-dot"></span>
            <h3 className="h6 fw-semibold mb-1">{item.title}</h3>
            <p className="small text-secondary mb-1">{item.description}</p>
            <span className="small text-secondary">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityTimeline
