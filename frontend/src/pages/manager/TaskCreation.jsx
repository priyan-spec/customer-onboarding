import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import EmployeeAssignment from '../../components/EmployeeAssignment.jsx'
import TaskCard from '../../components/TaskCard.jsx'
import { managerNav, tasks } from '../../data/mockData.js'

function TaskCreation() {
  const [mode, setMode] = useState('create')

  return (
    <DashboardLayout
      title="Tasks"
      subtitle="Create, update, and assign tasks for customer project work."
      navItems={managerNav}
      roleLabel="Project Manager"
      userName="Maya Singh"
    >
      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <section className="app-card p-3 p-xl-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="h5 fw-bold mb-1">Task form</h2>
                <p className="text-secondary mb-0">Set priority, due date, and current status.</p>
              </div>
              <div className="btn-group" role="group" aria-label="Task form mode">
                <button className={`btn btn-sm ${mode === 'create' ? 'btn-primary' : 'btn-outline-primary'}`} type="button" onClick={() => setMode('create')}>
                  Create
                </button>
                <button className={`btn btn-sm ${mode === 'update' ? 'btn-primary' : 'btn-outline-primary'}`} type="button" onClick={() => setMode('update')}>
                  Update
                </button>
              </div>
            </div>

            <form className="vstack gap-3">
              <div>
                <label className="form-label fw-semibold" htmlFor="taskTitle">Task Title</label>
                <input id="taskTitle" className="form-control" type="text" placeholder="Configure customer workspace" />
              </div>
              <div>
                <label className="form-label fw-semibold" htmlFor="taskDescription">Task Description</label>
                <textarea id="taskDescription" className="form-control" rows="4" placeholder="Describe the task and expected deliverable."></textarea>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" htmlFor="taskPriority">Priority</label>
                  <select id="taskPriority" className="form-select" defaultValue="MEDIUM">
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" htmlFor="taskDueDate">Due Date</label>
                  <input id="taskDueDate" className="form-control" type="date" />
                </div>
              </div>
              <div>
                <label className="form-label fw-semibold" htmlFor="taskStatus">Status</label>
                <select id="taskStatus" className="form-select" defaultValue="TODO">
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-2 pt-2">
                <button className="btn btn-primary" type="button">
                  <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                  Create Task
                </button>
                <button className="btn btn-outline-primary" type="button">
                  <i className="bi bi-pencil-square me-2" aria-hidden="true"></i>
                  Update Task
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="col-12 col-xl-7">
          <EmployeeAssignment />
        </div>

        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h5 fw-bold mb-0">Current tasks</h2>
            <span className="badge badge-soft-blue rounded-pill">{tasks.length} tasks</span>
          </div>
          <div className="row g-3">
            {tasks.map((task) => (
              <div className="col-12 col-lg-6 col-xxl-3" key={task.id}>
                <TaskCard task={task} interactive={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TaskCreation
