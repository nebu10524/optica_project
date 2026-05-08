import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import AnalisisRetina from '../components/AnalisisRetina'

export default function AnalisisRetinaPage() {
  const [pacientes, setPacientes] = useState([])
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [visible, setVisible] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pacienteIdUrl = searchParams.get('paciente_id')

  useEffect(() => {
    api.get('pacientes').then(res => {
      setPacientes(res.data)

      if (pacienteIdUrl) {
        const pacienteEncontrado = res.data.find(
          p => String(p.id) === String(pacienteIdUrl)
        )

        if (pacienteEncontrado) {
          setPacienteSeleccionado(pacienteEncontrado)
        }
      }
    })

    setTimeout(() => setVisible(true), 80)
  }, [pacienteIdUrl])

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .pac-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          cursor: pointer;
        }
        .pac-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13,79,160,0.12) !important;
          border-color: #93c5fd !important;
        }
      `}</style>

      <div style={s.content}>
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            marginBottom: 28
          }}
        >
          <button onClick={() => navigate('/')} style={s.backBtn}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver al dashboard
          </button>

          <div style={s.pageTag}>Inteligencia Artificial</div>
          <h2 style={s.pageTitle}>Análisis de Retinografía — IA</h2>
          <p style={s.pageSub}>
            Selecciona un paciente para analizar su imagen de retina con IA
          </p>
        </div>

        {!pacienteSeleccionado ? (
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s'
            }}
          >
            <div style={s.sectionLabel}>Selecciona el paciente</div>

            {pacientes.length === 0 ? (
              <div style={s.emptyState}>
                <div style={{ fontSize: 36, marginBottom: 12, color: '#94a3b8' }}>○</div>
                <div style={{ fontSize: 15, color: '#94a3b8' }}>
                  No hay pacientes registrados
                </div>
              </div>
            ) : (
              <div style={s.grid}>
                {pacientes.map((p, i) => (
                  <div
                    key={p.id}
                    className="pac-card"
                    onClick={() => setPacienteSeleccionado(p)}
                    style={{
                      ...s.pacCard,
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(10px)',
                      transition: `opacity 0.35s ease ${0.15 + i * 0.04}s, transform 0.35s ease ${0.15 + i * 0.04}s`
                    }}
                  >
                    <div style={s.avatar}>
                      {`${p.nombre?.[0] || ''}${p.apellido?.[0] || ''}`.toUpperCase()}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={s.pacNombre}>
                        {p.nombre} {p.apellido}
                      </div>
                      <div style={s.pacDni}>DNI: {p.dni || '—'}</div>
                    </div>

                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 3l5 5-5 5"
                        stroke="#94a3b8"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={s.selectedBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={s.avatar}>
                  {`${pacienteSeleccionado.nombre?.[0] || ''}${pacienteSeleccionado.apellido?.[0] || ''}`.toUpperCase()}
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                    {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    DNI: {pacienteSeleccionado.dni || '—'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPacienteSeleccionado(null)}
                style={s.cambiarBtn}
              >
                Cambiar paciente
              </button>
            </div>

            <AnalisisRetina
              pacienteId={pacienteSeleccionado.id}
              nombrePaciente={`${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`}
            />
          </div>
        )}
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
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  content: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '32px 36px 56px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
    padding: '0 0 12px',
    fontFamily: "'Sora', system-ui, sans-serif",
  },
  pageTag: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: '#1e293b',
    margin: '0 0 4px',
  },
  pageSub: {
    fontSize: 13,
    color: '#64748b',
    margin: 0,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 14,
    letterSpacing: '0.3px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  pacCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: '#ffffff',
    borderRadius: 14,
    padding: '14px 18px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: '#dbeafe',
    color: '#1e40af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  pacNombre: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
  },
  pacDni: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  selectedBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    background: '#ffffff',
    borderRadius: 14,
    padding: '14px 20px',
    marginBottom: 20,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
  },
  cambiarBtn: {
    background: '#f1f5f9',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
    fontFamily: "'Sora', system-ui, sans-serif",
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 0',
  },
}