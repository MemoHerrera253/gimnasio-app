import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Socios     from './pages/Socios'
import Membresias from './pages/Membresias'
import Pagos      from './pages/Pagos'
import Clases     from './pages/Clases'
import Usuarios   from './pages/Usuarios'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"      element={<Login />} />
          <Route path="/"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/socios"     element={<ProtectedRoute><Socios /></ProtectedRoute>} />
          <Route path="/membresias" element={<ProtectedRoute><Membresias /></ProtectedRoute>} />
          <Route path="/pagos"      element={<ProtectedRoute><Pagos /></ProtectedRoute>} />
          <Route path="/clases"     element={<ProtectedRoute><Clases /></ProtectedRoute>} />
          <Route path="/usuarios"   element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
          <Route path="*"           element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}