import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

const formVacio = { nombre: '', correo: '', contrasena: '', rol: 'recepcionista' }

export default function Usuarios() {
  const { usuario } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(formVacio)
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [exitoMsg, setExitoMsg] = useState('')

  // Redireccionar si no es administrador
  if (!usuario.token) {
    return <Navigate to="/login" />
  }
  if (usuario.rol !== 'administrador') {
    return <Navigate to="/" />
  }

  const cargar = () => {
    api.get('/usuarios')
      .then(({ data }) => {
        if (data && data.usuarios) {
          setUsuarios(data.usuarios)
        }
      })
      .catch((err) => {
        console.error('Error al cargar usuarios:', err)
        setErrorMsg('No se pudieron cargar los usuarios.')
      })
  }

  useEffect(() => {
    cargar()
  }, [])

  const abrirNuevo = () => {
    setForm(formVacio)
    setEditId(null)
    setErrorMsg('')
    setExitoMsg('')
    setModal(true)
  }

  const abrirEditar = (u) => {
    setForm({
      nombre: u.nombre || '',
      correo: u.correo || '',
      contrasena: '',
      rol: u.rol || 'recepcionista'
    })
    setEditId(u.id_usuario)
    setErrorMsg('')
    setExitoMsg('')
    setModal(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setExitoMsg('')
    try {
      if (editId) {
        // Editar: enviar sin contraseña
        const payload = {
          nombre: form.nombre,
          correo: form.correo,
          rol: form.rol
        }
        await api.put(`/usuarios/${editId}`, payload)
        setExitoMsg('Usuario actualizado correctamente.')
      } else {
        // Crear: requiere todos los campos
        if (!form.contrasena) {
          setErrorMsg('La contraseña es requerida para nuevos usuarios.')
          return
        }
        await api.post('/usuarios', form)
        setExitoMsg('Usuario creado correctamente.')
      }
      setModal(false)
      cargar()
    } catch (err) {
      console.error('Error al guardar usuario:', err)
      setErrorMsg(err.response?.data?.mensaje || 'Ocurrió un error al guardar el usuario.')
    }
  }

  const toggleEstado = async (u) => {
    setErrorMsg('')
    setExitoMsg('')
    const esMismo = String(u.id_usuario) === String(usuario.id)
    if (esMismo) {
      alert('No puedes desactivarte a ti mismo.')
      return
    }

    const accion = u.activo === 1 ? 'desactivar' : 'reactivar'
    if (confirm(`¿Estás seguro de que deseas ${accion} a este usuario?`)) {
      try {
        if (u.activo === 1) {
          await api.delete(`/usuarios/${u.id_usuario}`)
          setExitoMsg('Usuario desactivado correctamente.')
        } else {
          await api.patch(`/usuarios/${u.id_usuario}/reactivar`)
          setExitoMsg('Usuario reactivado correctamente.')
        }
        cargar()
      } catch (err) {
        console.error(`Error al ${accion} usuario:`, err)
        setErrorMsg(err.response?.data?.mensaje || `Error al ${accion} al usuario.`)
      }
    }
  }

  const filtrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400">Gestión de Usuarios</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">Administra las cuentas y accesos del personal del gimnasio</p>
          </div>
          <button onClick={abrirNuevo}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition-colors duration-200 shadow-sm flex items-center gap-1">
            <span>➕</span> Registrar usuario
          </button>
        </div>

        {/* Mensajes de feedback */}
        {exitoMsg && (
          <div className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 mb-4 text-sm flex justify-between items-center animate-fade-in">
            <span>✅ {exitoMsg}</span>
            <button onClick={() => setExitoMsg('')} className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-800 font-bold">&times;</button>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-100 dark:bg-rose-950/30 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-lg p-3 mb-4 text-sm flex justify-between items-center animate-fade-in">
            <span>❌ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-600 dark:text-rose-500 hover:text-rose-800 font-bold">&times;</button>
          </div>
        )}

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o correo..."
              value={busqueda}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 shadow-xs"
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-650 dark:hover:text-slate-200 text-xs">
                &times;
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 dark:bg-slate-950 text-white border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3.5 text-left font-semibold">ID</th>
                <th className="px-5 py-3.5 text-left font-semibold">Nombre</th>
                <th className="px-5 py-3.5 text-left font-semibold">Correo</th>
                <th className="px-5 py-3.5 text-left font-semibold">Rol</th>
                <th className="px-5 py-3.5 text-left font-semibold">Estado</th>
                <th className="px-5 py-3.5 text-left font-semibold">Creado el</th>
                <th className="px-5 py-3.5 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtrados.map((u, i) => {
                const esMismo = String(u.id_usuario) === String(usuario.id)
                return (
                  <tr key={u.id_usuario} className={i % 2 === 0 
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-gray-50/50 dark:hover:bg-slate-750/30 transition-colors duration-150 border-b border-gray-100 dark:border-slate-700' 
                    : 'bg-blue-50/20 dark:bg-slate-850/30 text-slate-800 dark:text-slate-200 hover:bg-gray-50/50 dark:hover:bg-slate-750/30 transition-colors duration-150 border-b border-gray-100 dark:border-slate-700'}>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500 dark:text-slate-400">{u.id_usuario}</td>
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                      {u.nombre} {esMismo && <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold px-2 py-0.5 rounded ml-1.5">Tú</span>}
                    </td>
                    <td className="px-5 py-3">{u.correo}</td>
                    <td className="px-5 py-3">
                      {u.rol === 'administrador' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          🛡️ Administrador
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          💼 Recepcionista
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {u.activo === 1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-slate-400"></span>
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-550 dark:text-slate-400 text-xs">
                      {u.creado_en ? new Date(u.creado_en).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button onClick={() => abrirEditar(u)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors duration-150 shadow-xs">
                          Editar
                        </button>
                        
                        {u.activo === 1 ? (
                          <button 
                            onClick={() => toggleEstado(u)}
                            disabled={esMismo}
                            className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors duration-150 shadow-xs ${
                              esMismo 
                                ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed' 
                                : 'bg-red-500 hover:bg-red-650 text-white'
                            }`}>
                            Desactivar
                          </button>
                        ) : (
                          <button onClick={() => toggleEstado(u)}
                            className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors duration-150 shadow-xs">
                            Reactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400 dark:text-slate-500">
                    No se encontraron usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md text-slate-900 dark:text-slate-100 transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400 font-sans">
                  {editId ? '📝 Editar usuario' : '👤 Registrar nuevo usuario'}
                </h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl font-bold">
                  &times;
                </button>
              </div>
              
              <form onSubmit={guardar} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 block mb-1">Nombre Completo *</label>
                  <input required type="text" value={form.nombre}
                    placeholder="Ej. Juan Pérez"
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 block mb-1">Correo Electrónico *</label>
                  <input required type="email" value={form.correo}
                    placeholder="Ej. juan@gimnasio.com"
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    onChange={(e) => setForm({ ...form, correo: e.target.value })} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 block mb-1">Rol de Acceso *</label>
                  <select value={form.rol}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                    <option value="recepcionista">💼 Recepcionista</option>
                    <option value="administrador">🛡️ Administrador</option>
                  </select>
                </div>

                {/* Mostrar contraseña sólo en creación */}
                {!editId && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 block mb-1">Contraseña *</label>
                    <input required type="password" value={form.contrasena}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                      onChange={(e) => setForm({ ...form, contrasena: e.target.value })} />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 border border-gray-300 dark:border-slate-750 rounded-lg py-2 text-sm text-gray-650 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-200">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-lg py-2 text-sm font-semibold cursor-pointer transition-colors duration-200 shadow-sm">
                    {editId ? 'Guardar cambios' : 'Registrar usuario'}
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
