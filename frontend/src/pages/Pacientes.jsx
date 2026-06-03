import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [visible,  setVisible]    = useState(false)

  // Búsqueda por DNI (RENIEC)
  const [dni, setDni]           = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError]       = useState('')
  const [iniciando, setIniciando] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    api.get('pacientes').then(res => setPacientes(res.data)).catch(() => {})
    setTimeout(() => setVisible(true), 80)
  }, [])

  const dniValido = /^\d{8}$/.test(dni)

  const buscar = async () => {
    if (!dniValido || buscando) return
    setBuscando(true)
    setError('')
    setResultado(null)
    try {
      const res = await api.get(`reniec/${dni}`)
      setResultado(res.data)
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo consultar el DNI. Intenta nuevamente.'
      setError(msg)
    } finally {
      setBuscando(false)
    }
  }

  const realizarEvaluacion = async () => {
    if (!resultado || iniciando) return
    setIniciando(true)
    setError('')
    try {
      const res = await api.post('pacientes/desde-dni', { dni: resultado.dni })
      const paciente = res.data
      navigate(`/retina?paciente_id=${paciente.id}`)
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo iniciar la evaluación.'
      setError(msg)
      setIniciando(false)
    }
  }

  const onKeyDownDni = (e) => {
    if (e.key === 'Enter') buscar()
  }

  const iniciales = (nombre, apellido) =>
    `${nombre?.[0] || ''}${apellido?.[0] || ''}`.toUpperCase()

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: #f8fafc !important; }
        .btn-action { transition: filter 0.15s, transform 0.15s; text-decoration: none; }
        .btn-action:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .dni-input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        ...s.header,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease'
      }}>
        <div>
          <div style={s.pageTag}>Atención</div>
          <h2 style={s.pageTitle}>Buscar paciente</h2>
          <p style={s.pageSub}>
            Ingresa el DNI para obtener los datos desde RENIEC e iniciar la evaluación
          </p>
        </div>
      </div>

      {/* ── Buscador por DNI ── */}
      <div style={{
        ...s.searchCard,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.45s ease 0.08s, transform 0.45s ease 0.08s'
      }}>
        <label htmlFor="dni-input" style={s.label}>Documento de Identidad (DNI)</label>
        <div style={s.searchRow}>
          <div style={s.inputWrap}>
            <svg style={s.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="#94a3b8" strokeWidth="1.4" />
              <line x1="10" y1="10" x2="14" y2="14" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              id="dni-input"
              className="dni-input"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="Ej: 72639576"
              value={dni}
              onChange={e => {
                const limpio = e.target.value.replace(/\D/g, '').slice(0, 8)
                setDni(limpio)
                setResultado(null)
                setError('')
              }}
              onKeyDown={onKeyDownDni}
              style={s.input}
            />
          </div>
          <button
            onClick={buscar}
            disabled={!dniValido || buscando}
            className="btn-action"
            style={{
              ...s.btnBuscar,
              opacity: (!dniValido || buscando) ? 0.55 : 1,
              cursor: (!dniValido || buscando) ? 'not-allowed' : 'pointer',
            }}
          >
            {buscando ? (
              <>
                <span style={s.spinner} />
                Buscando...
              </>
            ) : 'Buscar'}
          </button>
        </div>
        {!dniValido && dni.length > 0 && (
          <div style={s.hint}>El DNI debe tener 8 dígitos.</div>
        )}
        {error && <div style={s.errorBox}>{error}</div>}
      </div>

      {/* ── Resultado de la búsqueda ── */}
      {resultado && (
        <div style={s.resultCard}>
          <div style={s.resultHead}>
            <div style={s.avatar}>
              {iniciales(resultado.nombres, resultado.apellido)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={s.resultName}>
                {resultado.nombre_completo}
              </div>
              <div style={s.resultMeta}>
                <span style={s.badge}>DNI: {resultado.dni}</span>
                {resultado.ya_registrado && (
                  <span style={s.badgeOk}>Ya registrado</span>
                )}
                <span style={s.fuente}>
                  {resultado.fuente === 'reniec' ? 'Datos de RENIEC' : 'Datos locales'}
                </span>
              </div>
            </div>
          </div>

          <div style={s.datosGrid}>
            <div style={s.dato}>
              <div style={s.datoLabel}>Nombres</div>
              <div style={s.datoValor}>{resultado.nombres || '—'}</div>
            </div>
            <div style={s.dato}>
              <div style={s.datoLabel}>Apellidos</div>
              <div style={s.datoValor}>{resultado.apellido || '—'}</div>
            </div>
            <div style={s.dato}>
              <div style={s.datoLabel}>DNI</div>
              <div style={s.datoValor}>{resultado.dni}</div>
            </div>
          </div>

          <button
            onClick={realizarEvaluacion}
            disabled={iniciando}
            className="btn-action"
            style={{
              ...s.btnEvaluar,
              opacity: iniciando ? 0.6 : 1,
              cursor: iniciando ? 'not-allowed' : 'pointer',
            }}
          >
            {iniciando ? (
              <>
                <span style={s.spinner} />
                Preparando evaluación...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="white" strokeWidth="1.4" />
                  <circle cx="8" cy="8" r="2.2" stroke="white" strokeWidth="1.4" />
                </svg>
                Realizar evaluación
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Pacientes ya atendidos (acceso a historial) ── */}
      {pacientes.length > 0 && (
        <div style={{
          ...s.tableWrap,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.45s ease 0.2s, transform 0.45s ease 0.2s'
        }}>
          <div style={s.tableTitle}>Pacientes atendidos</div>
          <div style={s.tableHead}>
            <div style={{ ...s.thCell, flex: 2 }}>Paciente</div>
            <div style={{ ...s.thCell, flex: 1 }}>DNI</div>
            <div style={{ ...s.thCell, flex: 1, textAlign: 'right' }}>Acciones</div>
          </div>

          {pacientes.map((p) => (
            <div key={p.id} className="row-hover" style={s.tableRow}>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ ...s.avatarSm }}>
                  {iniciales(p.nombre, p.apellido)}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                  {p.nombre} {p.apellido}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {p.dni
                  ? <span style={s.badge}>{p.dni}</span>
                  : <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>}
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Link to={`/retina?paciente_id=${p.id}`} className="btn-action" style={s.btnEvaluarSm}>
                  Evaluar
                </Link>
                <Link to={`/historial/${p.id}`} className="btn-action" style={s.btnHistorial}>
                  Historial
                </Link>
              </div>
            </div>
          ))}
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
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#1e293b', margin: '0 0 4px' },
  pageSub: { fontSize: 13, color: '#64748b', margin: 0 },

  // Search card
  searchCard: {
    background: '#ffffff',
    borderRadius: 14,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
    padding: '22px 24px',
    marginBottom: 22,
    maxWidth: 620,
  },
  label: {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#475569',
    marginBottom: 8, letterSpacing: '0.3px',
  },
  searchRow: { display: 'flex', gap: 10, alignItems: 'stretch' },
  inputWrap: { position: 'relative', flex: 1 },
  searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' },
  input: {
    width: '100%', height: 46,
    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '0 14px 0 40px', fontSize: 15, color: '#1e293b',
    letterSpacing: '1px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  btnBuscar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: '#1e3a5f', color: '#fff',
    padding: '0 26px', borderRadius: 8,
    fontSize: 14, fontWeight: 600, border: 'none',
    boxShadow: '0 6px 18px rgba(30,58,95,0.2)',
    minWidth: 120,
  },
  hint: { fontSize: 12, color: '#ef4444', marginTop: 8 },
  errorBox: {
    marginTop: 12, padding: '10px 14px', borderRadius: 8,
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#b91c1c', fontSize: 13,
  },

  // Result card
  resultCard: {
    background: '#ffffff',
    borderRadius: 14,
    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
    border: '1px solid #dbeafe',
    padding: '22px 24px',
    marginBottom: 26,
    maxWidth: 620,
  },
  resultHead: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 },
  avatar: {
    width: 48, height: 48, borderRadius: '50%',
    background: '#1e3a5f', color: '#f8fbff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15, fontWeight: 700, flexShrink: 0,
  },
  resultName: { fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 6 },
  resultMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  fuente: { fontSize: 11, color: '#94a3b8' },

  datosGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12, marginBottom: 20,
    padding: '16px', background: '#f8fafc', borderRadius: 10,
  },
  dato: {},
  datoLabel: {
    fontSize: 11, color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.5px', marginBottom: 3, fontWeight: 600,
  },
  datoValor: { fontSize: 14, color: '#1e293b', fontWeight: 500 },

  btnEvaluar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', background: '#059669', color: '#fff',
    padding: '13px', borderRadius: 10, border: 'none',
    fontSize: 14, fontWeight: 700, letterSpacing: '0.2px',
    boxShadow: '0 6px 18px rgba(5,150,105,0.25)',
  },

  // Table
  tableWrap: {
    background: '#ffffff', borderRadius: 14,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0', overflow: 'hidden',
  },
  tableTitle: {
    fontSize: 13, fontWeight: 700, color: '#1e293b',
    padding: '16px 20px 0',
  },
  tableHead: {
    display: 'flex', alignItems: 'center',
    padding: '14px 20px', background: '#f8fafc',
    borderBottom: '1px solid #f1f5f9', marginTop: 12,
  },
  thCell: {
    fontSize: 11, fontWeight: 600, color: '#475569',
    letterSpacing: '1px', textTransform: 'uppercase',
  },
  tableRow: {
    display: 'flex', alignItems: 'center',
    padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
  },
  avatarSm: {
    width: 36, height: 36, borderRadius: '50%',
    background: '#2563eb', color: '#f8fbff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  badge: {
    background: '#f8fafc', color: '#475569',
    padding: '3px 10px', borderRadius: 6,
    fontSize: 12, fontWeight: 500, letterSpacing: '0.5px',
    border: '1px solid #e2e8f0',
  },
  badgeOk: {
    background: '#ecfdf5', color: '#059669',
    padding: '3px 10px', borderRadius: 6,
    fontSize: 11, fontWeight: 600,
    border: '1px solid #a7f3d0',
  },
  btnEvaluarSm: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#059669', color: '#fff',
    padding: '7px 14px', borderRadius: 8,
    fontSize: 12, fontWeight: 600,
  },
  btnHistorial: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#ffffff', color: '#1e3a5f',
    border: '1px solid #dbe4ee',
    padding: '6px 13px', borderRadius: 8,
    fontSize: 12, fontWeight: 600,
  },
  spinner: {
    width: 14, height: 14, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
    display: 'inline-block', animation: 'spin 0.7s linear infinite',
  },
}
