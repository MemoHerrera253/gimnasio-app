import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout, theme, toggleTheme } = useAuth()

  const handleLogout = () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas cerrar sesión?')
    if (confirmar) {
      logout()
    }
  }

  return (
    <aside className="w-56 min-h-screen bg-blue-900 dark:bg-slate-950 text-white flex flex-col p-4 transition-colors duration-200 border-r border-transparent dark:border-slate-800">
      <h2 className="text-xl font-bold mb-8 text-white dark:text-blue-400">🏋️ Gimnasio</h2>
      <nav className="flex flex-col gap-3 flex-1">
        <Link to="/"           className="hover:bg-blue-700 hover:dark:bg-slate-800 px-3 py-2 rounded transition-colors dark:text-slate-300 dark:hover:text-white">📊 Dashboard</Link>
        <Link to="/socios"     className="hover:bg-blue-700 hover:dark:bg-slate-800 px-3 py-2 rounded transition-colors dark:text-slate-300 dark:hover:text-white">👥 Socios</Link>
        <Link to="/membresias" className="hover:bg-blue-700 hover:dark:bg-slate-800 px-3 py-2 rounded transition-colors dark:text-slate-300 dark:hover:text-white">🏷 Membresías</Link>
        <Link to="/pagos"      className="hover:bg-blue-700 hover:dark:bg-slate-800 px-3 py-2 rounded transition-colors dark:text-slate-300 dark:hover:text-white">💰 Pagos</Link>
        <Link to="/clases"     className="hover:bg-blue-700 hover:dark:bg-slate-800 px-3 py-2 rounded transition-colors dark:text-slate-300 dark:hover:text-white">🤸 Clases</Link>
        {usuario?.rol === 'administrador' && (
          <Link to="/usuarios" className="hover:bg-blue-700 hover:dark:bg-slate-800 px-3 py-2 rounded transition-colors dark:text-slate-300 dark:hover:text-white">⚙️ Usuarios</Link>
        )}
      </nav>
      
      <button onClick={toggleTheme}
        className="mb-3 bg-blue-850 hover:bg-blue-700 dark:bg-slate-850 dark:hover:bg-slate-800 text-white px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-blue-800 dark:border-slate-800">
        {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
      </button>

      <button onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-semibold cursor-pointer transition-colors">
        🚪 Cerrar sesión
      </button>
    </aside>
  )
}