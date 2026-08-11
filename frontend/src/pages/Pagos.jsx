import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const formVacio = { id_socio: '', monto: '', fecha_pago: '', metodo: 'efectivo' }

export default function Pagos() {
  const [pagos, setPagos]       = useState([])
  const [socios, setSocios]     = useState([])
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(formVacio)
  const [montoFijo, setMontoFijo] = useState(false)

  const cargar = () => {
    api.get('/pagos').then(({ data }) => setPagos(data.pagos || []))
    api.get('/socios').then(({ data }) => setSocios(data.socios || []))
  }
  useEffect(() => { cargar() }, [])

  const abrirModal = () => {
    setForm(formVacio)
    setMontoFijo(false)
    setModal(true)
  }

  // Cuando cambia el socio seleccionado, auto-rellenar monto si tiene membresía
  const handleSocioChange = (id_socio) => {
    const socio = socios.find(s => String(s.id_socio) === String(id_socio))
    if (socio && socio.precio_membresia) {
      setForm(prev => ({ ...prev, id_socio, monto: parseFloat(socio.precio_membresia).toFixed(2) }))
      setMontoFijo(true)
    } else {
      setForm(prev => ({ ...prev, id_socio, monto: '' }))
      setMontoFijo(false)
    }
  }

  const guardar = async (e) => {
    e.preventDefault()
    await api.post('/pagos', form)
    setModal(false)
    setForm(formVacio)
    setMontoFijo(false)
    cargar()
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">Gestión de Pagos</h1>

        <button onClick={abrirModal}
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition-colors duration-200">
          + Registrar pago
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 dark:bg-slate-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Socio</th>
                <th className="px-4 py-3 text-left">Monto</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Método</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((p, i) => (
                <tr key={p.id_pago} className={i % 2 === 0
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700 transition-colors duration-200'
                  : 'bg-blue-50/40 dark:bg-slate-850/50 text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700 transition-colors duration-200'}>
                  <td className="px-4 py-2">{p.id_pago}</td>
                  <td className="px-4 py-2 font-medium">{p.socio_nombre} {p.socio_apellido}</td>
                  <td className="px-4 py-2 font-semibold text-green-700 dark:text-green-400">${p.monto}</td>
                  <td className="px-4 py-2">{p.fecha_pago?.slice(0,10)}</td>
                  <td className="px-4 py-2 capitalize">{p.metodo}</td>
                </tr>
              ))}
              {pagos.length === 0 && (
                <tr><td colSpan="5" className="text-center py-6 text-gray-400 dark:text-slate-500">No hay pagos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-sm text-slate-900 dark:text-slate-100 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400">Registrar pago</h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl font-bold">&times;</button>
              </div>
              <form onSubmit={guardar} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Socio *</label>
                  <select required value={form.id_socio}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 cursor-pointer"
                    onChange={(e) => handleSocioChange(e.target.value)}>
                    <option value="">Seleccionar socio...</option>
                    {socios.map(s => (
                      <option key={s.id_socio} value={s.id_socio}>
                        {s.nombre} {s.apellido}
                        {s.nombre_membresia ? ` — ${s.nombre_membresia}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">
                    Monto *
                    {montoFijo && (
                      <span className="ml-2 text-blue-600 dark:text-blue-400 font-normal">
                        🔒 precio de membresía
                      </span>
                    )}
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500 text-sm">$</span>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.monto}
                      readOnly={montoFijo}
                      disabled={montoFijo}
                      className={`w-full pl-7 border rounded px-3 py-2 text-sm focus:outline-none transition-colors duration-200 ${
                        montoFijo
                          ? 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 cursor-not-allowed font-semibold'
                          : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 dark:focus:border-blue-400'
                      }`}
                      onChange={(e) => !montoFijo && setForm({ ...form, monto: e.target.value })}
                    />
                  </div>
                  {montoFijo && (
                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                      El monto corresponde al precio de la membresía asignada al socio.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Fecha *</label>
                  <input required type="date" value={form.fecha_pago}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, fecha_pago: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Método *</label>
                  <select value={form.metodo}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 cursor-pointer"
                    onChange={(e) => setForm({ ...form, metodo: e.target.value })}>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 border border-gray-300 dark:border-slate-750 rounded py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-200">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded py-2 text-sm font-semibold cursor-pointer transition-colors duration-200">
                    Registrar pago
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}