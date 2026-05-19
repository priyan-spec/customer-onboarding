import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleSelection from './pages/RoleSelection.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/create" element={<ProtectedRoute><CreateOnboarding /></ProtectedRoute>} />
        <Route path="/customer/projects" element={<ProtectedRoute><CustomerProjects /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/project/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/manager/projects" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/team-member" element={<ProtectedRoute><TeamDashboard /></ProtectedRoute>} />
        <Route path="/team-member/tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
        <Route path="/team-member/projects" element={<ProtectedRoute><TeamProjects /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
