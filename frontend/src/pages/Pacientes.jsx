import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda]   = useState('')
  const [visible,  setVisible]    = useState(false)

  useEffect(() => {
    api.get('pacientes').then(res => setPacientes(res.data))
    setTimeout(() => setVisible(true), 80)
  }, [])

  const filtrados = pacientes.filter(p => {
    const q = busqueda.toLowerCase()
    return (
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
      (p.dni      || '').toLowerCase().includes(q) ||
      (p.telefono || '').toLowerCase().includes(q)
    )
  })

  // Iniciales para avatar
  const iniciales = (p) =>
    `${p.nombre?.[0] || ''}${p.apellido?.[0] || ''}`.toUpperCase()

  // Color de avatar según id
  const avatarColors = ['#2563eb']
  const avatarColor  = (id) => avatarColors[id % avatarColors.length]

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: #f8fafc !important; }
        .btn-action { transition: filter 0.15s, transform 0.15s; text-decoration: none; }
        .btn-action:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .search-input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; outline: none; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        ...s.header,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease'
      }}>
        <div>
          <div style={s.pageTag}>Gestión</div>
          <h2 style={s.pageTitle}>Pacientes</h2>
          <p style={s.pageSub}>
            {`${pacientes.length} paciente${pacientes.length === 1 ? '' : 's'} registrado${pacientes.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link to="/pacientes/nuevo" style={s.btnNuevo} className="btn-action">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <line x1="8" y1="2" x2="8" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Nuevo paciente
        </Link>
      </div>

      {/* ── Buscador ── */}
      <div style={{
        ...s.searchWrap,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease 0.08s'
      }}>
        <div style={s.searchBox}>
          <svg style={s.searchIcon} width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="#94a3b8" strokeWidth="1.4" />
            <line x1="10" y1="10" x2="14" y2="14" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por nombre, DNI o teléfono..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={s.searchInput}
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} style={s.clearBtn}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <line x1="2" y1="2" x2="12" y2="12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="2" x2="2"  y2="12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {busqueda && (
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
            {`${filtrados.length} resultado${filtrados.length === 1 ? '' : 's'} para "${busqueda}"`}
          </div>
        )}
      </div>

      {/* ── Tabla ── */}
      <div style={{
        ...s.tableWrap,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.45s ease 0.14s, transform 0.45s ease 0.14s'
      }}>
        {/* Cabecera */}
        <div style={s.tableHead}>
          <div style={{ ...s.thCell, width: 48,  color: '#64748b' }}>#</div>
          <div style={{ ...s.thCell, flex: 2 }}>Paciente</div>
          <div style={{ ...s.thCell, flex: 1 }}>DNI</div>
          <div style={{ ...s.thCell, flex: 1 }}>Teléfono</div>
          <div style={{ ...s.thCell, flex: 1, textAlign: 'right' }}>Acciones</div>
        </div>

        {/* Filas */}
        {filtrados.length === 0 ? (
          <div style={s.emptyState}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 16, opacity: 0.3 }}>
              <circle cx="24" cy="17" r="8" stroke="#0d4fa0" strokeWidth="2" />
              <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#0d4fa0" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
              {busqueda ? 'Sin resultados' : 'No hay pacientes'}
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1' }}>
              {busqueda ? 'Intenta con otro término de búsqueda' : 'Agrega el primer paciente con el botón de arriba'}
            </div>
          </div>
        ) : (
          filtrados.map((p, i) => (
            <div
              key={p.id}
              className="row-hover"
              style={{
                ...s.tableRow,
                background: i % 2 === 0 ? '#ffffff' : '#fcfdff',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.35s ease ${0.18 + i * 0.04}s, transform 0.35s ease ${0.18 + i * 0.04}s, background 0.15s`,
              }}
            >
              {/* # */}
              <div style={{ width: 48, fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                {p.id}
              </div>

              {/* Paciente */}
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ ...s.avatar, background: avatarColor(p.id) }}>
                  {iniciales(p)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                    {p.nombre} {p.apellido}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                    Paciente registrado
                  </div>
                </div>
              </div>

              {/* DNI */}
              <div style={{ flex: 1 }}>
                {p.dni
                  ? <span style={s.badge}>{p.dni}</span>
                  : <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
                }
              </div>

              {/* Teléfono */}
              <div style={{ flex: 1, fontSize: 13, color: p.telefono ? '#475569' : '#94a3b8' }}>
                {p.telefono || '—'}
              </div>

              {/* Acciones */}
              <div style={{ flex: 1, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Link to={`/retina?paciente_id=${p.id}`} className="btn-action" style={s.btnEvaluar}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  Evaluar
                </Link>
                <Link to={`/historial/${p.id}`} className="btn-action" style={s.btnHistorial}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="1" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <line x1="5" y1="5"  x2="11" y2="5"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="5" y1="8"  x2="11" y2="8"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="5" y1="11" x2="8"  y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Historial
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      {filtrados.length > 0 && (
        <div style={{
          fontSize: 12, color: '#cbd5e1', textAlign: 'right',
          marginTop: 12, paddingRight: 4,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.4s'
        }}>
          Mostrando {filtrados.length} de {pacientes.length} pacientes
        </div>
      )}
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
    padding: '32px 36px 48px',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },

  // Header
  header: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 24,
    flexWrap: 'wrap', gap: 16,
  },
  pageTag: {
    fontSize: 11, fontWeight: 600, color: '#94a3b8',
    background: '#ffffff', display: 'inline-block',
    padding: '3px 12px', borderRadius: 20,
    border: '1px solid #e2e8f0',
    letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24, fontWeight: 700, color: '#1e293b', margin: '0 0 4px',
  },
  pageSub: {
    fontSize: 13, color: '#64748b', margin: 0,
  },
  btnNuevo: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#1e3a5f', color: '#fff',
    padding: '10px 22px', borderRadius: 8,
    fontSize: 13, fontWeight: 600, letterSpacing: '0.2px',
    border: 'none', cursor: 'pointer', alignSelf: 'flex-start',
    boxShadow: '0 6px 18px rgba(30,58,95,0.2)',
  },

  // Search
  searchWrap: { marginBottom: 20 },
  searchBox: {
    position: 'relative', maxWidth: 420,
  },
  searchIcon: {
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%', height: 42,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '0 40px 0 40px',
    fontSize: 13, color: '#1e293b',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  clearBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
  },

  // Table
  tableWrap: {
    background: '#ffffff',
    borderRadius: 14,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  tableHead: {
    display: 'flex', alignItems: 'center',
    padding: '14px 20px',
    background: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
  },
  thCell: {
    fontSize: 11, fontWeight: 600, color: '#475569',
    letterSpacing: '1px', textTransform: 'uppercase',
  },
  tableRow: {
    display: 'flex', alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #f1f5f9',
  },

  // Avatar
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#f8fbff', flexShrink: 0,
    letterSpacing: '0.5px',
  },

  // Badge DNI
  badge: {
    background: '#f8fafc', color: '#475569',
    padding: '3px 10px', borderRadius: 6,
    fontSize: 12, fontWeight: 500, letterSpacing: '0.5px',
    border: '1px solid #e2e8f0',
  },

  // Botones acción
  btnEvaluar: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#059669', color: '#fff',
    padding: '7px 13px', borderRadius: 8,
    fontSize: 12, fontWeight: 600,
  },
  btnHistorial: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#ffffff', color: '#1e3a5f',
    border: '1px solid #dbe4ee',
    padding: '6px 12px', borderRadius: 8,
    fontSize: 12, fontWeight: 600,
  },

  // Empty
  emptyState: {
    padding: '56px 20px',
    textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
}