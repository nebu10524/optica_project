import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Historial() {
  const { pacienteId } = useParams()
  const navigate = useNavigate()

  const [paciente, setPaciente] = useState(null)
  const [historial, setHistorial] = useState([])
  const [visible, setVisible] = useState(false)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [modalAnalisis, setModalAnalisis] = useState({ abierto: false, id: null })
  const [eliminandoAnalisis, setEliminandoAnalisis] = useState(false)

  useEffect(() => {
    api.get(`/pacientes/${pacienteId}`).then(res => setPaciente(res.data))
    api.get(`/historial/${pacienteId}`).then(res => setHistorial(res.data))
    setTimeout(() => setVisible(true), 80)
  }, [pacienteId])

  const iniciales = (p) =>
    `${p?.nombre?.[0] || ''}${p?.apellido?.[0] || ''}`.toUpperCase()

  const formatFecha = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—'

  const clasificacionConfig = {
    'Sin RD': { color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
    'Leve': { color: '#ca8a04', bg: '#fef9c3', border: '#fde68a' },
    'Moderada': { color: '#ea580c', bg: '#ffedd5', border: '#fdba74' },
    'Severa/Proliferativa': { color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
  }

  const getClasificacion = (valor) =>
    clasificacionConfig[valor] || {
      color: '#64748b',
      bg: '#f1f5f9',
      border: '#e0e6ef',
    }

  const abrirModalEliminar = () => {
    setMostrarModalEliminar(true)
  }

  const cerrarModalEliminar = () => {
    if (eliminando) return
    setMostrarModalEliminar(false)
  }

  const eliminarPaciente = async () => {
    try {
      setEliminando(true)
      await api.delete(`/pacientes/${pacienteId}`)
      navigate('/pacientes')
    } catch {
      alert('No se pudo eliminar el paciente. Intenta nuevamente.')
    } finally {
      setEliminando(false)
    }
  }

  const abrirModalEliminarAnalisis = (id) => {
    setModalAnalisis({ abierto: true, id })
  }

  const cerrarModalEliminarAnalisis = () => {
    if (eliminandoAnalisis) return
    setModalAnalisis({ abierto: false, id: null })
  }

  const eliminarAnalisis = async () => {
    if (!modalAnalisis.id) return

    try {
      setEliminandoAnalisis(true)
      await api.delete(`/historial/${modalAnalisis.id}`)
      setHistorial((prev) => prev.filter((item) => item.id !== modalAnalisis.id))
      setModalAnalisis({ abierto: false, id: null })
    } catch {
      alert('No se pudo eliminar el análisis. Intenta nuevamente.')
    } finally {
      setEliminandoAnalisis(false)
    }
  }

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: #f0f6ff !important; }
        .btn-action {
          transition: filter 0.18s ease, transform 0.15s ease;
          text-decoration: none;
        }
        .btn-action:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
      `}</style>

      <div
        style={{
          ...s.header,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div>
          <button onClick={() => navigate('/pacientes')} style={s.backBtn}>
            ← Volver a pacientes
          </button>

          <div style={s.pageTag}>Registros clínicos</div>
          <h2 style={s.pageTitle}>Historial de retina</h2>
          <p style={s.pageSub}>
            {historial.length} análisis registrado{historial.length !== 1 ? 's' : ''}
          </p>
        </div>

        {paciente && (
          <div style={s.actionsWrap}>
            <div style={s.pacienteChip}>
              <div style={s.pacienteAvatar}>{iniciales(paciente)}</div>
              <div>
                <div style={s.pacienteNombre}>
                  {paciente.nombre} {paciente.apellido}
                </div>
                <div style={s.pacienteDni}>DNI: {paciente.dni || '—'}</div>
              </div>
            </div>

            <button className="btn-action" style={s.btnDangerSoft} onClick={abrirModalEliminar}>
              Eliminar paciente
            </button>
          </div>
        )}
      </div>

      {historial.length > 0 && (
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={{ ...s.statNumber, color: '#0d4fa0' }}>
              {historial.length}
            </div>
            <div style={s.statLabel}>Análisis realizados</div>
          </div>

          <div style={s.statCard}>
            <div style={{ ...s.statNumber, color: '#0696D7' }}>
              {historial[0].clasificacion}
            </div>
            <div style={s.statLabel}>Última clasificación</div>
          </div>

          <div style={s.statCard}>
            <div style={{ ...s.statNumber, color: '#0696D7' }}>
              {historial[0].nivel_confianza}
            </div>
            <div style={s.statLabel}>Confianza reciente</div>
          </div>

          <div style={s.statCard}>
            <div style={{ ...s.statNumber, color: '#dc2626' }}>
              {historial[0].urgencia}
            </div>
            <div style={s.statLabel}>Urgencia reciente</div>
          </div>
        </div>
      )}

      <div
        style={{
          ...s.tableWrap,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.45s ease 0.2s, transform 0.45s ease 0.2s',
        }}
      >
        <div style={s.tableHead}>
          <div style={{ ...s.thCell, flex: 1.4 }}>Fecha</div>
          <div style={{ ...s.thCell, flex: 1.6 }}>Clasificación</div>
          <div style={{ ...s.thCell, flex: 1 }}>Urgencia</div>
          <div style={{ ...s.thCell, flex: 1 }}>Confianza</div>
          <div style={{ ...s.thCell, flex: 0.9, textAlign: 'right' }}>Acción</div>
        </div>

        {historial.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👁️</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#9db0cf', marginBottom: 4 }}>
              Sin análisis de retina
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 24 }}>
              Este paciente aún no tiene análisis con IA registrados
            </div>

            <button
              className="btn-action"
              style={s.btnPrimary}
              onClick={() => navigate(`/retina?paciente_id=${pacienteId}`)}
            >
              Realizar primer análisis
            </button>
          </div>
        ) : (
          historial.map((h, i) => {
            const cfg = getClasificacion(h.clasificacion)

            return (
              <div
                key={h.id}
                className="row-hover"
                style={{
                  ...s.tableRow,
                  background: i % 2 === 0 ? '#ffffff' : '#fcfdff',
                }}
              >
                <div style={{ flex: 1.4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    {formatFecha(h.fecha_analisis)}
                  </div>
                  {i === 0 && <div style={s.latestBadge}>Último</div>}
                </div>

                <div style={{ flex: 1.6 }}>
                  <span
                    style={{
                      ...s.badge,
                      color: cfg.color,
                      background: cfg.bg,
                      border: `0.5px solid ${cfg.border}`,
                    }}
                  >
                    {h.clasificacion}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <span style={s.badge}>{h.urgencia}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <span style={s.badge}>{h.nivel_confianza}</span>
                </div>

                <div style={{ flex: 0.9, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn-action"
                    style={s.btnRowDanger}
                    onClick={() => abrirModalEliminarAnalisis(h.id)}
                  >
                    Eliminar
                  </button>
                </div>

              </div>
            )
          })
        )}
      </div>

      {historial.length > 0 && (
        <div style={s.footer}>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Mostrando {historial.length} análisis
          </div>

          <button
            className="btn-action"
            style={s.btnPrimary}
            onClick={() => navigate(`/retina?paciente_id=${pacienteId}`)}
          >
            Nuevo análisis
          </button>
        </div>
      )}

      {mostrarModalEliminar && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>Eliminar paciente</h3>
            <p style={s.modalText}>
              Esta acción eliminará al paciente y todos sus datos relacionados (análisis, historial e imágenes).
              No se puede deshacer.
            </p>
            <p style={s.modalHint}>¿Estás seguro/a de continuar?</p>

            <div style={s.modalActions}>
              <button className="btn-action" style={s.btnNeutral} onClick={cerrarModalEliminar} disabled={eliminando}>
                Cancelar
              </button>
              <button className="btn-action" style={s.btnDanger} onClick={eliminarPaciente} disabled={eliminando}>
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAnalisis.abierto && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>Eliminar análisis</h3>
            <p style={s.modalText}>
              Esta acción eliminará el análisis seleccionado y su imagen asociada. No se puede deshacer.
            </p>
            <p style={s.modalHint}>¿Estás seguro/a de continuar?</p>

            <div style={s.modalActions}>
              <button className="btn-action" style={s.btnNeutral} onClick={cerrarModalEliminarAnalisis} disabled={eliminandoAnalisis}>
                Cancelar
              </button>
              <button className="btn-action" style={s.btnDanger} onClick={eliminarAnalisis} disabled={eliminandoAnalisis}>
                {eliminandoAnalisis ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
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
    padding: '32px 36px 56px',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
    padding: '0 0 12px',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  pageTag: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    background: '#ffffff',
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 4px',
  },
  pageSub: {
    fontSize: 13,
    color: '#64748b',
    margin: 0,
  },
  pacienteChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#ffffff',
    borderRadius: 14,
    padding: '14px 20px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
    position: 'relative',
  },
  actionsWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  pacienteAvatar: {
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
  },
  pacienteNombre: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
  },
  pacienteDni: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '18px 16px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  tableWrap: {
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  tableHead: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    background: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
  },
  thCell: {
    fontSize: 11,
    fontWeight: 600,
    color: '#475569',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #f1f5f9',
  },
  latestBadge: {
    display: 'inline-block',
    marginTop: 4,
    fontSize: 10,
    fontWeight: 700,
    color: '#1d4ed8',
    background: '#eff6ff',
    padding: '2px 8px',
    borderRadius: 20,
  },
  badge: {
    background: '#f8fafc',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  btnPrimary: {
    background: '#1e3a5f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    boxShadow: '0 4px 14px rgba(13,79,160,0.25)',
  },
  btnDangerSoft: {
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  btnRowDanger: {
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
    borderRadius: 8,
    padding: '6px 10px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    background: '#ffffff',
    borderRadius: 14,
    border: '1px solid #e2e8f0',
    boxShadow: '0 24px 50px rgba(2,6,23,0.24)',
    padding: 18,
  },
  modalTitle: {
    margin: '0 0 8px',
    color: '#881337',
    fontSize: 18,
    fontWeight: 800,
  },
  modalText: {
    margin: '0 0 8px',
    color: '#475569',
    fontSize: 13,
    lineHeight: 1.6,
  },
  modalHint: {
    margin: '0 0 12px',
    color: '#334155',
    fontSize: 12,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },
  btnNeutral: {
    background: '#f8fafc',
    color: '#334155',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '9px 14px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  btnDanger: {
    background: '#be123c',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '9px 14px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  emptyState: {
    padding: '56px 20px',
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
}