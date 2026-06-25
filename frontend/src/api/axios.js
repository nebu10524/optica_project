import axios from 'axios'

// Dirección del backend: usa la variable de entorno o, si no existe, la local
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Cliente de axios que usaremos en toda la app (le quitamos la "/" final)
const api = axios.create({
  baseURL: API_URL.replace(/\/$/, '')
})

// Antes de cada petición, adjuntamos el token guardado (si el usuario inició sesión)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api