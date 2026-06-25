import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import api from '../api/axios'
import { AuthContext } from './auth-context'

// Recupera el usuario guardado en el navegador (para mantener la sesión al recargar)
const obtenerUsuarioGuardado = () => {
  try {
    const raw = localStorage.getItem('usuario')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Provee a toda la app el usuario actual y las funciones de iniciar/cerrar sesión
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuarioGuardado)

  // Inicia sesión: pide el token al backend y lo guarda en el navegador
  const login = useCallback(async (email, password) => {
    const res = await api.post('login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    setUsuario(res.data.usuario)
  }, [])

  // Cierra sesión: avisa al backend y borra los datos guardados
  const logout = useCallback(async () => {
    await api.post('logout')
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }, [])

  // Lo que queda disponible para el resto de la app
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
