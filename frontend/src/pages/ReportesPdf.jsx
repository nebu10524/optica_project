import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePacientes from '../hooks/usePacientes'
import { pageBackground } from '../theme/pageStyles'

// Pantalla para elegir un paciente y entrar a sus reportes PDF
export default function ReportesPdf() {
  const { pacientes } = usePacientes()
  const [filtro, setFiltro] = useState('')
  const navigate = useNavigate()

  // Filtra la lista por nombre, apellido o DNI según lo que se escriba
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
    ...pageBackground,
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
