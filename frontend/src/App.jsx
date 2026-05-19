import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection.jsx'
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx'
import CreateOnboarding from './pages/customer/CreateOnboarding.jsx'
import CustomerProjects from './pages/customer/CustomerProjects.jsx'
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx'
import ProjectDetails from './pages/manager/ProjectDetails.jsx'
import TeamDashboard from './pages/team/TeamDashboard.jsx'
import MyTasks from './pages/team/MyTasks.jsx'
import TeamProjects from './pages/team/TeamProjects.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/create" element={<CreateOnboarding />} />
        <Route path="/customer/projects" element={<CustomerProjects />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/project/:projectId" element={<ProjectDetails />} />
        <Route path="/manager/projects" element={<ManagerDashboard />} />
        <Route path="/team-member" element={<TeamDashboard />} />
        <Route path="/team-member/tasks" element={<MyTasks />} />
        <Route path="/team-member/projects" element={<TeamProjects />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
