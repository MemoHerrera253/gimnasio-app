import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const formRegistroVacio = {
  nombre: '', correo: '', contrasena: '', confirmar: '', rol: 'recepcionista'
}

export default function Login() {
  const [vista, setVista]       = useState('login') // 'login' o 'registro'
  const [form, setForm]         = useState({ correo: '', contrasena: '' })
  const [formReg, setFormReg]   = useState(formRegistroVacio)
  const [error, setError]       = useState('')
  const [exito, setExito]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login, theme, toggleTheme } = useAuth()
  const navigate                = useNavigate()

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/usuarios/login', form)
      login(data)
      navigate('/')
    } catch {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  // ── REGISTRO ──
  const handleRegistro = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')

    if (formReg.contrasena !== formReg.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (formReg.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await api.post('/usuarios/registro', {
        nombre:     formReg.nombre,
        correo:     formReg.correo,
        contrasena: formReg.contrasena,
        rol:        formReg.rol,
      })
      setExito('¡Usuario creado correctamente! Ya puedes iniciar sesión.')
      setFormReg(formRegistroVacio)
      setTimeout(() => {
        setVista('login')
        setExito('')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  const cambiarVista = (v) => {
    setVista(v)
    setError('')
    setExito('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors duration-200 relative">
      {/* Selector de Tema */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-md text-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-slate-700"
        title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        type="button"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-sm border border-gray-200 dark:border-slate-700 transition-colors duration-200">

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-5xl">🏋️</span>
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mt-2">Gimnasio App</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Sistema de Gestión</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b dark:border-slate-700">
          <button
            onClick={() => cambiarVista('login')}
            className={`flex-1 pb-2 text-sm font-semibold transition border-b-2 ${
              vista === 'login'
                ? 'border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'
            }`}>
            Iniciar sesión
          </button>
          <button
            onClick={() => cambiarVista('registro')}
            className={`flex-1 pb-2 text-sm font-semibold transition border-b-2 ${
              vista === 'registro'
                ? 'border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'
            }`}>
            Registrarse
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-2 rounded mb-4">
            ⚠ {error}
          </div>
        )}
        {exito && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 text-sm px-4 py-2 rounded mb-4">
            ✅ {exito}
          </div>
        )}

        {/* ── FORMULARIO LOGIN ── */}
        {vista === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Correo electrónico
              </label>
              <input
                type="email" required placeholder="usuario@correo.com"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Contraseña
              </label>
              <input
                type="password" required placeholder="••••••••"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-900 text-white py-2 rounded font-semibold text-sm transition cursor-pointer">
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => cambiarVista('registro')}
                className="text-blue-700 dark:text-blue-400 hover:underline font-semibold cursor-pointer bg-transparent border-0 p-0">
                Regístrate aquí
              </button>
            </p>
          </form>
        )}

        {/* ── FORMULARIO REGISTRO ── */}
        {vista === 'registro' && (
          <form onSubmit={handleRegistro} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Nombre completo *
              </label>
              <input
                type="text" required placeholder="Juan Pérez"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                value={formReg.nombre}
                onChange={(e) => setFormReg({ ...formReg, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Correo electrónico *
              </label>
              <input
                type="email" required placeholder="usuario@correo.com"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                value={formReg.correo}
                onChange={(e) => setFormReg({ ...formReg, correo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Rol *
              </label>
              <select
                className="w-full border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-950 text-gray-500 dark:text-slate-400 rounded px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                value={formReg.rol}
                disabled
                onChange={(e) => setFormReg({ ...formReg, rol: e.target.value })}>
                <option value="recepcionista">Recepcionista</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Contraseña * <span className="text-gray-400 dark:text-slate-500 font-normal">(mínimo 6 caracteres)</span>
              </label>
              <input
                type="password" required placeholder="••••••••"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                value={formReg.contrasena}
                onChange={(e) => setFormReg({ ...formReg, contrasena: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Confirmar contraseña *
              </label>
              <input
                type="password" required placeholder="••••••••"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                value={formReg.confirmar}
                onChange={(e) => setFormReg({ ...formReg, confirmar: e.target.value })}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-900 text-white py-2 rounded font-semibold text-sm transition mt-2 cursor-pointer">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => cambiarVista('login')}
                className="text-blue-700 dark:text-blue-400 hover:underline font-semibold cursor-pointer bg-transparent border-0 p-0">
                Inicia sesión
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  )
}