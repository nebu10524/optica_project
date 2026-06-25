import { useEffect, useState } from 'react'
import api from '../api/axios'

// Carga la lista de pacientes una vez al montar el componente.
// Centraliza la llamada repetida a api.get('pacientes').
export default function usePacientes() {
  const [pacientes, setPacientes] = useState([])

  useEffect(() => {
    let activo = true
    api
      .get('pacientes')
      .then((res) => {
        if (activo) setPacientes(res.data || [])
      })
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [])

  return { pacientes }
}
