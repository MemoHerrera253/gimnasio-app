import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth()
  return usuario.token ? children : <Navigate to="/login" />
}