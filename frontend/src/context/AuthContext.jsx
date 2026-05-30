import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import api from '../api/axios'

const AuthContext = createContext(null)

const obtenerUsuarioGuardado = () => {
  try {
    const raw = localStorage.getItem('usuario')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuarioGuardado)

  const login = useCallback(async (email, password) => {
    const res = await api.post('login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    setUsuario(res.data.usuario)
  }, [])

  const logout = useCallback(async () => {
    await api.post('logout')
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }, [])

  const value = useMemo(() => ({ usuario, login, logout }), [usuario, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}

export const useAuth = () => useContext(AuthContext)
