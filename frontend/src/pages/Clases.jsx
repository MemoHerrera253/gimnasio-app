import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const formVacio = { nombre: '', instructor: '', horario: '', capacidad: '' }

export default function Clases() {
  const [clases, setClases] = useState([])
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(formVacio)
  const [editId, setEditId] = useState(null)

  const cargar = () => api.get('/clases').then(({ data }) => setClases(data.clases || []))
  useEffect(() => { cargar() }, [])

  const abrirNuevo  = () => { setForm(formVacio); setEditId(null); setModal(true) }
  const abrirEditar = (c) => { setForm(c); setEditId(c.id_clase); setModal(true) }

  const guardar = async (e) => {
    e.preventDefault()
    if (editId) await api.put(`/clases/${editId}`, form)
    else        await api.post('/clases', form)
    setModal(false)
    cargar()
  }

  const eliminar = async (id) => {
    if (confirm('¿Eliminar esta clase?')) {
      await api.delete(`/clases/${id}`)
      cargar()
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">Gestión de Clases</h1>

        <button onClick={abrirNuevo}
          className="mb-4 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition-colors duration-200">
          + Agregar clase
        </button>

        <div className="grid grid-cols-3 gap-4">
          {clases.map(c => (
            <div key={c.id_clase} className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 border border-gray-150 dark:border-slate-700 transition-colors duration-200">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">🤸 {c.nombre}</h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">👤 {c.instructor}</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">🕐 {c.horario}</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">👥 Capacidad: {c.capacidad}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => abrirEditar(c)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-1 rounded text-xs font-semibold cursor-pointer transition-colors duration-200">
                  ✏ Editar
                </button>
                <button onClick={() => eliminar(c.id_clase)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-xs font-semibold cursor-pointer transition-colors duration-200">
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-sm text-slate-900 dark:text-slate-100 transition-colors duration-200">
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4">
                {editId ? 'Editar clase' : 'Nueva clase'}
              </h2>
              <form onSubmit={guardar} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Nombre *</label>
                  <input required value={form.nombre}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Instructor *</label>
                  <input required value={form.instructor}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Horario *</label>
                  <input required value={form.horario} placeholder="Ej: Lun-Mié-Vie 7:00am"
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, horario: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Capacidad *</label>
                  <input required type="number" value={form.capacidad}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, capacidad: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 border border-gray-300 dark:border-slate-750 rounded py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-200">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded py-2 text-sm font-semibold cursor-pointer transition-colors duration-200">
                    {editId ? 'Guardar cambios' : 'Crear clase'}
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