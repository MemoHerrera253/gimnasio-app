import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const formVacio = { nombre: '', duracion_dias: '', precio: '', descripcion: '' }

export default function Membresias() {
  const [membresias, setMembresias] = useState([])
  const [modal, setModal]           = useState(false)
  const [form, setForm]             = useState(formVacio)
  const [editId, setEditId]         = useState(null)

  const cargar = () => api.get('/membresias').then(({ data }) => setMembresias(data.membresias || []))
  useEffect(() => { cargar() }, [])

  const abrirNuevo  = () => { setForm(formVacio); setEditId(null); setModal(true) }
  const abrirEditar = (m) => { setForm(m); setEditId(m.id_membresia); setModal(true) }

  const guardar = async (e) => {
    e.preventDefault()
    if (editId) await api.put(`/membresias/${editId}`, form)
    else        await api.post('/membresias', form)
    setModal(false)
    cargar()
  }

  const eliminar = async (id) => {
    if (confirm('¿Eliminar esta membresía?')) {
      await api.delete(`/membresias/${id}`)
      cargar()
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">Gestión de Membresías</h1>

        <button onClick={abrirNuevo}
          className="mb-4 bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition-colors duration-200">
          + Agregar tipo de membresía
        </button>

        <div className="grid grid-cols-3 gap-4">
          {membresias.map(m => (
            <div key={m.id_membresia} className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 border border-gray-150 dark:border-slate-700 transition-colors duration-200">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">{m.nombre}</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm">{m.duracion_dias} días</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">${m.precio}</p>
              {m.descripcion && <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">{m.descripcion}</p>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => abrirEditar(m)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-1 rounded text-xs font-semibold cursor-pointer transition-colors duration-200">
                  ✏ Editar
                </button>
                <button onClick={() => eliminar(m.id_membresia)}
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
                {editId ? 'Editar membresía' : 'Nueva membresía'}
              </h2>
              <form onSubmit={guardar} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Nombre *</label>
                  <input required value={form.nombre}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Duración (días) *</label>
                  <input required type="number" value={form.duracion_dias}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, duracion_dias: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Precio *</label>
                  <input required type="number" step="0.01" value={form.precio}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Descripción</label>
                  <textarea value={form.descripcion} rows={2}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 border border-gray-300 dark:border-slate-750 rounded py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-200">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex-1 bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded py-2 text-sm font-semibold cursor-pointer transition-colors duration-200">
                    {editId ? 'Guardar cambios' : 'Crear membresía'}
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