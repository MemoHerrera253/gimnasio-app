import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Dashboard() {
  const { usuario } = useAuth()
  const navigate    = useNavigate()
  const [stats, setStats] = useState({ socios: 0, ingresos: 0, porVencer: 0 })
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    api.get('/socios').then(({ data }) =>
      setStats(prev => ({ ...prev, socios: data.socios ? data.socios.length : 0 }))
    ).catch(() => {})
    api.get('/pagos').then(({ data }) => {
      const hoy = new Date()
      const mesActual = hoy.getMonth()
      const pagosArr = data.pagos || []
      const total = pagosArr
        .filter(p => new Date(p.fecha_pago).getMonth() === mesActual)
        .reduce((acc, p) => acc + parseFloat(p.monto), 0)
      setStats(prev => ({ ...prev, ingresos: total }))
    }).catch(() => {})
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-6">Bienvenido, {usuario.nombre}</p>

        {/* Tarjetas métricas */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center border border-transparent dark:border-slate-700 transition-colors duration-200">
            <p className="text-4xl font-bold text-blue-800 dark:text-blue-450">{stats.socios}</p>
            <p className="text-gray-500 dark:text-slate-400 mt-2">👥 Socios activos</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center border border-transparent dark:border-slate-700 transition-colors duration-200">
            <p className="text-4xl font-bold text-green-700 dark:text-green-400">${stats.ingresos.toFixed(2)}</p>
            <p className="text-gray-500 dark:text-slate-400 mt-2">💰 Ingresos del mes</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center border border-transparent dark:border-slate-700 transition-colors duration-200">
            <p className="text-4xl font-bold text-orange-500 dark:text-orange-400">{stats.porVencer}</p>
            <p className="text-gray-500 dark:text-slate-400 mt-2">⚠️ Membresías por vencer</p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => navigate('/socios')}
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded font-semibold text-sm cursor-pointer transition-colors duration-200">
            + Registrar socio
          </button>
          <button onClick={() => navigate('/pagos')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded font-semibold text-sm cursor-pointer transition-colors duration-200">
            💰 Registrar pago
          </button>
          <button onClick={() => navigate('/clases')}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded font-semibold text-sm cursor-pointer transition-colors duration-200">
            🤸 Ver clases
          </button>
        </div>
      </main>
    </div>
  )
}