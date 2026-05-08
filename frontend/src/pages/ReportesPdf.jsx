import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ReportesPdf() {
  const [pacientes, setPacientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('pacientes').then((res) => setPacientes(res.data || []))
  }, [])

  const pacientesFiltrados = useMemo(() => {
    const q = filtro.trim().toLowerCase()
    if (!q) return pacientes
    return pacientes.filter((p) =>
      `${p.nombre || ''} ${p.apellido || ''} ${p.dni || ''}`.toLowerCase().includes(q)
    )
  }, [pacientes, filtro])

  return (
    <div style={s.page}>
      <h2 style={s.title}>Centro de Reportes PDF</h2>
      <p style={s.sub}>
        Busca un paciente. Al seleccionar, verás todos sus análisis con imagen y podrás descargar PDF.
      </p>

      <div style={s.panel}>
        <input
          style={s.input}
          placeholder="Buscar por nombre o DNI..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div style={s.list}>
          {pacientesFiltrados.slice(0, 30).map((p) => (
            <button
              key={p.id}
              style={{
                ...s.item,
              }}
              onClick={() => navigate(`/reportes-pdf/${p.id}`)}
            >
              <strong>{p.nombre} {p.apellido}</strong>
              <span style={s.itemMeta}>DNI: {p.dni || '—'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    backgroundImage:
      'repeating-linear-gradient(135deg, rgba(22,49,85,0.035) 0px, rgba(22,49,85,0.035) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(45deg, rgba(30,58,95,0.02) 0px, rgba(30,58,95,0.02) 1px, transparent 1px, transparent 28px), radial-gradient(circle at 12% 18%, rgba(30,58,95,0.08) 0px, rgba(30,58,95,0) 230px), radial-gradient(circle at 88% 82%, rgba(37,99,235,0.07) 0px, rgba(37,99,235,0) 220px)',
    backgroundRepeat: 'repeat, repeat, no-repeat, no-repeat',
    padding: '32px 36px',
  },
  title: { margin: 0, fontSize: 24, color: '#1e293b' },
  sub: { marginTop: 8, color: '#64748b', fontSize: 13 },
  panel: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16, marginTop: 16 },
  input: {
    width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px',
    marginBottom: 12, fontSize: 13, outline: 'none',
  },
  list: { display: 'grid', gap: 10, maxHeight: 360, overflow: 'auto' },
  item: {
    border: '1px solid #e2e8f0', background: '#fff', borderRadius: 10, padding: '10px 12px',
    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  itemMeta: { color: '#64748b', fontSize: 12 },
}
