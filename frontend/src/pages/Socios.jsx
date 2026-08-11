import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const formVacio = { nombre: '', apellido: '', telefono: '', correo: '', fecha_inscripcion: '', id_membresia: '' }

export default function Socios() {
  const [socios, setSocios]         = useState([])
  const [membresias, setMembresias] = useState([])
  const [modal, setModal]           = useState(false)
  const [form, setForm]             = useState(formVacio)
  const [editId, setEditId]         = useState(null)
  const [busqueda, setBusqueda]     = useState('')

  const cargar = () => api.get('/socios').then(({ data }) => setSocios(data.socios || []))

  useEffect(() => {
    cargar()
    api.get('/membresias').then(({ data }) => setMembresias(data.membresias || []))
  }, [])

  const abrirNuevo = () => { setForm(formVacio); setEditId(null); setModal(true) }
  const abrirEditar = (s) => {
    setForm({
      nombre:             s.nombre            || '',
      apellido:           s.apellido          || '',
      telefono:           s.telefono          || '',
      correo:             s.correo            || '',
      fecha_inscripcion:  s.fecha_inscripcion || '',
      id_membresia:       s.id_membresia      || ''
    })
    setEditId(s.id_socio)
    setModal(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      id_membresia: form.id_membresia || null
    }
    if (editId) await api.put(`/socios/${editId}`, payload)
    else        await api.post('/socios', payload)
    setModal(false)
    cargar()
  }

  const darBaja = async (id) => {
    if (confirm('¿Dar de baja a este socio?')) {
      await api.delete(`/socios/${id}`)
      cargar()
    }
  }

  const filtrados = socios.filter(s =>
    `${s.nombre} ${s.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">Gestión de Socios</h1>

        <div className="flex gap-4 mb-4">
          <input
            type="text" placeholder="🔍 Buscar por nombre..."
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm w-80 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button onClick={abrirNuevo}
            className="ml-auto bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition-colors duration-200">
            + Registrar socio
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 dark:bg-slate-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Membresía</th>
                <th className="px-4 py-3 text-left">Inscripción</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((s, i) => (
                <tr key={s.id_socio} className={i % 2 === 0
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700 transition-colors duration-200'
                  : 'bg-blue-50/40 dark:bg-slate-850/50 text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700 transition-colors duration-200'}>
                  <td className="px-4 py-2 text-xs font-mono text-gray-500 dark:text-slate-400">{s.id_socio}</td>
                  <td className="px-4 py-2 font-medium">{s.nombre} {s.apellido}</td>
                  <td className="px-4 py-2">{s.telefono}</td>
                  <td className="px-4 py-2">{s.correo || '-'}</td>
                  <td className="px-4 py-2">
                    {s.nombre_membresia
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          🏷 {s.nombre_membresia}
                        </span>
                      : <span className="text-gray-400 dark:text-slate-500 text-xs">Sin membresía</span>
                    }
                  </td>
                  <td className="px-4 py-2">{s.fecha_inscripcion?.slice(0,10)}</td>
                  <td className="px-4 py-2 text-center flex gap-2 justify-center">
                    <button onClick={() => abrirEditar(s)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs cursor-pointer transition-colors duration-200">
                      Editar
                    </button>
                    <button onClick={() => darBaja(s.id_socio)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs cursor-pointer transition-colors duration-200">
                      Dar de baja
                    </button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan="7" className="text-center py-6 text-gray-400 dark:text-slate-500">No se encontraron socios</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md text-slate-900 dark:text-slate-100 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400">
                  {editId ? 'Editar socio' : 'Registrar nuevo socio'}
                </h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl font-bold">&times;</button>
              </div>
              <form onSubmit={guardar} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Nombre *</label>
                    <input required value={form.nombre}
                      className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Apellido *</label>
                    <input required value={form.apellido}
                      className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Teléfono *</label>
                  <input required value={form.telefono}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Correo</label>
                  <input type="email" value={form.correo}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, correo: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Tipo de Membresía</label>
                  <select value={form.id_membresia}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 cursor-pointer"
                    onChange={(e) => setForm({ ...form, id_membresia: e.target.value })}>
                    <option value="">-- Sin membresía --</option>
                    {membresias.map(m => (
                      <option key={m.id_membresia} value={m.id_membresia}>
                        {m.nombre} — ${parseFloat(m.precio).toFixed(2)} / {m.duracion_dias} días
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Fecha de inscripción *</label>
                  <input required type="date" value={form.fecha_inscripcion?.slice(0,10)}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, fecha_inscripcion: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 border border-gray-300 dark:border-slate-750 rounded py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-200">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded py-2 text-sm font-semibold cursor-pointer transition-colors duration-200">
                    {editId ? 'Guardar cambios' : 'Registrar socio'}
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