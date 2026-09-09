import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import ManagerInfo from './pages/ManagerInfo'
import CateringCompanies from './pages/CateringCompanies'
import Menu from './pages/Menu'
import StudentEvaluation from './pages/StudentEvaluation'
import ThreeStepForm from './pages/ThreeStepForm'
import Reports from './pages/Reports'
import Documents from './pages/Documents'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nguoi-phu-trach" element={<ManagerInfo />} />
            <Route path="/cong-ty-suat-an" element={<CateringCompanies />} />
            <Route path="/thuc-don" element={<Menu />} />
            <Route path="/danh-gia-hoc-sinh" element={<StudentEvaluation />} />
            <Route path="/bieu-mau-3-buoc" element={<ThreeStepForm />} />
            <Route path="/bao-cao" element={<Reports />} />
            <Route path="/van-ban-lien-quan" element={<Documents />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  )
}
