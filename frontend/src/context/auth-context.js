import { createContext, useContext } from 'react'

// Contexto donde se guardan los datos de sesión
export const AuthContext = createContext(null)

// Hook corto para leer la sesión desde cualquier componente
export const useAuth = () => useContext(AuthContext)
