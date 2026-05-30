import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import uronImg from '../assets/uron.png'

const mensajesUron = [
  'Ve directo a pacientes, historial o analisis de retina desde aqui.',
  'Cada evaluacion a tiempo puede marcar una gran diferencia visual.',
  'Hoy puedes avanzar revisando pacientes pendientes y su seguimiento.',
  'Un control ordenado mejora la atencion y la confianza del paciente.',
]

function obtenerSaludo(hora) {
  if (hora < 12) return 'Buenos días'
  if (hora < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function rotarMensaje(setMsgIndex, setShowMsg) {
  setShowMsg(false)
  setTimeout(() => {
    setMsgIndex(prev => (prev + 1) % mensajesUron.length)
    setShowMsg(true)
  }, 1400)
}

function DashboardCard({ delay, visible, onClick, icon, chip, eyebrow, titulo, descripcion, hoverNote }) {
  return (
    <button
      type="button"
      className="card-hover card-interactive"
      style={{
        ...s.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
      onClick={onClick}
    >
      <div style={s.accentBar} />
      <div style={s.cardHead}>
        <div style={s.iconBox}>{icon}</div>
        <span style={s.chip}>{chip}</span>
      </div>
      {eyebrow}
      <div className="card-title-main" style={s.cardTitle}>{titulo}</div>
      <div style={s.cardDesc}>{descripcion}</div>
      <div style={s.divider} />
      <div className="card-hover-note" style={s.hoverNote}>{hoverNote}</div>
    </button>
  )
}

DashboardCard.propTypes = {
  delay: PropTypes.number,
  visible: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node,
  chip: PropTypes.node,
  eyebrow: PropTypes.node,
  titulo: PropTypes.node,
  descripcion: PropTypes.node,
  hoverNote: PropTypes.node,
}

export default function Dashboard() {
  const [totalPacientes, setTotalPacientes] = useState(0)
  const [visible, setVisible] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [showMsg, setShowMsg] = useState(true)
  const { usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('pacientes').then(res => setTotalPacientes(res.data.length))
    setTimeout(() => setVisible(true), 80)
  }, [])

  useEffect(() => {
    const id = setInterval(() => rotarMensaje(setMsgIndex, setShowMsg), 8000)
    return () => clearInterval(id)
  }, [])

  const now = new Date()
  const saludo = obtenerSaludo(now.getHours())
  const nombreUsuario = usuario?.nombre || 'Doctor'

  const fechaFormateada = now.toLocaleDateString('es-PE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const subtitulo = `${fechaFormateada.charAt(0).toUpperCase()}${fechaFormateada.slice(1)} · Aquí tienes el resumen del sistema.`

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .card-hover {
          transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(30, 58, 95, 0.12) !important;
        }
        .card-interactive {
          cursor: pointer;
        }
        .card-hover-note {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .card-interactive:hover .card-hover-note {
          opacity: 1;
          transform: translateY(0);
        }
        .card-interactive:hover .card-title-main {
          color: #1e3a5f;
        }
        .uron-message {
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        @keyframes uronFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes uronPulse {
          0%, 100% { box-shadow: 0 8px 18px rgba(0,0,0,0.22); }
          50% { box-shadow: 0 14px 26px rgba(0,0,0,0.28); }
        }
        .hero-uron-wrap {
          animation: uronFloat 3.6s ease-in-out infinite;
        }
        .hero-uron-img {
          animation: uronPulse 3.2s ease-in-out infinite;
        }
        .btn-dash {
          transition: filter 0.18s ease, transform 0.15s ease;
          text-decoration: none;
        }
        .btn-dash:hover {
          filter: brightness(1.1);
          transform: translateX(2px);
        }
      `}</style>

      <div style={s.content}>

        {/* ── Bienvenida ── */}
        <div style={{
          ...s.welcomeBox,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s'
        }}>
          <div style={{ flex: 1 }}>
            <div style={s.welcomeTag}>Dashboard principal</div>
            <h1 style={s.welcomeTitle}>
              {`${saludo}, `}
              <span style={{ color: '#0696D7' }}>{nombreUsuario}</span>
              {' 👋'}
            </h1>
            <p style={s.welcomeSub}>{subtitulo}</p>
            <div style={s.systemPill}>
              <span style={s.systemDot} />
              Sistema activo
            </div>
          </div>
          <div style={s.heroAssistant} className="hero-uron-wrap">
            <p
              className="uron-message"
              style={{
                ...s.heroAssistantText,
                opacity: showMsg ? 1 : 0,
                transform: showMsg ? 'translateY(0)' : 'translateY(6px)',
              }}
            >
              {mensajesUron[msgIndex]}
            </p>
            <div style={s.heroAssistantFrame} className="hero-uron-img">
              <img src={uronImg} alt="Asistente Uron" style={s.heroAssistantImg} />
            </div>
          </div>
        </div>

        <div style={s.sectionLabel}>Resumen del dia</div>

        {/* ── Cards ── */}
        <div style={s.grid}>

          <DashboardCard
            delay={0.15}
            visible={visible}
            onClick={() => navigate('/pacientes')}
            icon={(
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="9" r="4.5" stroke="#2563eb" strokeWidth="1.8" />
                <path d="M4 23c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
            chip="Total"
            eyebrow={(
              <div style={{ fontSize: 46, fontWeight: 800, color: '#0696D7', lineHeight: 1, marginBottom: 6 }}>
                {totalPacientes}
              </div>
            )}
            titulo="Pacientes registrados"
            descripcion="Pacientes activos en el sistema de gestión visual"
            hoverNote="Entrar al panel de pacientes"
          />

          <DashboardCard
            delay={0.31}
            visible={visible}
            onClick={() => navigate('/pacientes')}
            icon={(
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect x="4" y="2" width="18" height="22" rx="3" stroke="#2563eb" strokeWidth="1.8" />
                <line x1="8" y1="8"  x2="18" y2="8"  stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="12" x2="18" y2="12" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="16" x2="14" y2="16" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            chip="Registros"
            eyebrow={(
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0696D7', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                Historial clínico
              </div>
            )}
            titulo="Historial de pacientes"
            descripcion="Consulta evaluaciones previas, resultados e interpretaciones clínicas"
            hoverNote="Revisar historial clínico"
          />

          <DashboardCard
            delay={0.39}
            visible={visible}
            onClick={() => navigate('/retina')}
            icon={(
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="9"   stroke="#7c3aed" strokeWidth="1.8" />
                <circle cx="13" cy="13" r="4.5" stroke="#7c3aed" strokeWidth="1.8" />
                <circle cx="13" cy="13" r="1.8" fill="#7c3aed" />
              </svg>
            )}
            chip="IA clínica"
            eyebrow={(
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0696D7', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                Retinografía
              </div>
            )}
            titulo="Análisis de Retina con IA"
            descripcion="Detecta signos de retinopatía diabética con IA. Clasificación automática y recomendación clínica por paciente."
            hoverNote="Abrir análisis de retinografía"
          />

          <DashboardCard
            delay={0.47}
            visible={visible}
            onClick={() => navigate('/reportes-pdf')}
            icon={(
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M7 3h9l4 4v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#2563eb" strokeWidth="1.8"/>
                <path d="M16 3v4h4" stroke="#2563eb" strokeWidth="1.8"/>
                <line x1="9" y1="12" x2="17" y2="12" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="9" y1="16" x2="17" y2="16" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            )}
            chip="PDF"
            eyebrow={(
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0696D7', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                Reportes
              </div>
            )}
            titulo="Descarga de informes PDF"
            descripcion="Genera reportes de resultados por paciente y descarga el historial completo en PDF."
            hoverNote="Abrir centro de reportes PDF"
          />

        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', fontSize: 11, color: '#bbb',
          letterSpacing: '1px', marginTop: 40,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.45s'
        }}>
          {`Multi Ópticas · Sistema de Gestión Visual · ${now.getFullYear()}`}
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
      "repeating-linear-gradient(135deg, rgba(22,49,85,0.035) 0px, rgba(22,49,85,0.035) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(45deg, rgba(30,58,95,0.02) 0px, rgba(30,58,95,0.02) 1px, transparent 1px, transparent 28px), radial-gradient(circle at 12% 22%, rgba(30,58,95,0.07) 0px, rgba(30,58,95,0) 210px), radial-gradient(circle at 88% 78%, rgba(5,150,105,0.06) 0px, rgba(5,150,105,0) 180px)",
    backgroundRepeat: 'repeat, repeat, no-repeat, no-repeat',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  content: { padding: '32px 36px 48px' },
  welcomeBox: {
    background: '#1e3a5f',
    backgroundImage:
      "linear-gradient(90deg, rgba(30,58,95,0.96), rgba(30,58,95,0.92)), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='260' viewBox='0 0 600 260'%3E%3Cellipse cx='390' cy='128' rx='120' ry='66' fill='%233b82f6' fill-opacity='0.22'/%3E%3Cellipse cx='390' cy='128' rx='82' ry='44' fill='%237dd3fc' fill-opacity='0.18'/%3E%3Ccircle cx='390' cy='128' r='27' fill='%23e0f2fe' fill-opacity='0.30'/%3E%3Ccircle cx='390' cy='128' r='12' fill='%231e3a5f' fill-opacity='0.65'/%3E%3C/svg%3E\")",
    backgroundPosition: 'center, right -36px center',
    backgroundSize: 'cover, 260px auto',
    backgroundRepeat: 'no-repeat, no-repeat',
    borderRadius: 16,
    padding: '28px 32px',
    marginBottom: 28,
    boxShadow: '0 12px 30px rgba(30, 58, 95, 0.22)',
    border: '1px solid rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  welcomeTag: {
    fontSize: 11, fontWeight: 600, color: '#e2e8f0',
    background: 'rgba(255,255,255,0.08)', display: 'inline-block',
    padding: '3px 12px', borderRadius: 20,
    letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 24, fontWeight: 700, color: '#ffffff',
    margin: '0 0 8px', lineHeight: 1.25,
  },
  welcomeSub: { fontSize: 13, color: '#93c5fd', margin: 0 },
  systemPill: {
    marginTop: 14,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#e2e8f0',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 999,
    padding: '6px 12px',
  },
  systemDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
  },
  sectionLabel: {
    padding: '4px 2px 12px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '2px',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  heroAssistant: {
    position: 'absolute',
    right: 18,
    top: '24%',
    transform: 'translateY(-24%)',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  heroAssistantText: {
    maxWidth: 230,
    margin: 0,
    fontSize: 12,
    lineHeight: 1.4,
    color: '#dbeafe',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 12,
    padding: '10px 12px',
    textShadow: '0 1px 2px rgba(0,0,0,0.22)',
  },
  heroAssistantFrame: {
    width: 108,
    height: 108,
    borderRadius: '50%',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.14)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAssistantImg: {
    width: 108,
    height: 108,
    objectFit: 'contain',
    transform: 'scale(1.08)',
    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 22,
  },
  card: {
    background: '#ffffff',
    borderRadius: 16,
    padding: '24px',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    textAlign: 'left',
    font: 'inherit',
    cursor: 'pointer',
  },
  accentBar: {
    display: 'none',
    borderRadius: '16px 16px 0 0',
  },
  cardHead: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 18, marginTop: 4,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 10,
    background: '#eff6ff',
    border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  chip: {
    fontSize: 11, fontWeight: 600,
    padding: '4px 10px', borderRadius: 20, letterSpacing: '0.3px',
    background: '#eff6ff', color: '#1d4ed8',
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 6 },
  cardDesc:  { fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1, marginBottom: 18 },
  divider:   { height: '1px', background: '#f1f5f9', marginBottom: 18 },
  hoverNote: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
    lineHeight: 1.45,
    fontWeight: 500,
  },
}
