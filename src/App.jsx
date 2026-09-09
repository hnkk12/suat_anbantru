import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppLayout from './components/layout/AppLayout'
import DashboardPlaceholder from './pages/DashboardPlaceholder'
import Dashboard from './pages/Dashboard'
import ManagerInfo from './pages/ManagerInfo'
import CateringCompanies from './pages/CateringCompanies'
import Menu from './pages/Menu'
import StudentEvaluation from './pages/StudentEvaluation'
import ThreeStepForm from './pages/ThreeStepForm'
import Reports from './pages/Reports'
import Documents from './pages/Documents'
import MenuPermissions from './pages/MenuPermissions'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Trang Tổng quan mẫu phong cách Gusto/TailwindUI */}
            <Route path="/" element={<DashboardPlaceholder />} />

            {/* Menu chính Sidebar */}
            <Route path="/nguoi-phu-trach" element={<ManagerInfo />} />
            <Route path="/cong-ty-suat-an" element={<CateringCompanies />} />
            <Route path="/thuc-don" element={<Menu />} />
            <Route path="/hoc-sinh" element={<Dashboard />} />
            <Route path="/danh-gia-hoc-sinh" element={<StudentEvaluation />} />

            {/* Phân quyền menu */}
            <Route path="/phan-quyen-menu" element={<MenuPermissions />} />
            <Route path="/admin/menu-permissions" element={<Navigate to="/phan-quyen-menu" replace />} />
            <Route path="/settings/permissions" element={<Navigate to="/phan-quyen-menu" replace />} />

            {/* Lối tắt & Tiện ích */}
            <Route path="/bieu-mau-3-buoc" element={<ThreeStepForm />} />
            <Route path="/bao-cao" element={<Reports />} />
            <Route path="/van-ban-lien-quan" element={<Documents />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  )
}
