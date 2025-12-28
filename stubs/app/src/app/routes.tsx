import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { LoansPage } from '@/pages/LoansPage'
import { WorkflowPocPage } from '@/pages/WorkflowPocPage'
import { WorkflowDefinitionsPage } from '@/pages/WorkflowDefinitionsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/loans" element={<LoansPage />} />
      <Route path="/workflow-poc" element={<WorkflowPocPage />} />
      <Route path="/workflow-definitions" element={<WorkflowDefinitionsPage />} />
      <Route path="/" element={<Navigate to="/workflow-poc" replace />} />
    </Routes>
  )
}
