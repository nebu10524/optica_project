import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario')) || null
  )

  const login = async (email, password) => {
    const res = await api.post('login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    setUsuario(res.data.usuario)
  }

  const logout = async () => {
    await api.post('logout')
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)