import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => ({
    token:  localStorage.getItem('token'),
    rol:    localStorage.getItem('rol'),
    nombre: localStorage.getItem('nombre'),
    id:     localStorage.getItem('id'),
  }))

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'light'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const login = (data) => {
    localStorage.setItem('token',  data.token)
    localStorage.setItem('rol',    data.rol)
    localStorage.setItem('nombre', data.nombre)
    localStorage.setItem('id',     data.id)
    setUsuario(data)
  }

  const logout = () => {
    localStorage.clear()
    setUsuario({ token: null, rol: null, nombre: null })
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)