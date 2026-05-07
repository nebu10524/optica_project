import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

const NIVEL_CONFIG = {
  'Sin RD': {
    color: '#22c55e',
    bg: '#f0fdf4',
    border: '#86efac',
    icon: '✅',
    label: 'Sin Retinopatía Diabética',
    urgencia_color: '#16a34a',
  },
  Leve: {
    color: '#eab308',
    bg: '#fefce8',
    border: '#fde047',
    icon: '🟡',
    label: 'Retinopatía Leve',
    urgencia_color: '#ca8a04',
  },
  Moderada: {
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fdba74',
    icon: '🟠',
    label: 'Retinopatía Moderada',
    urgencia_color: '#ea580c',
  },
  'Severa/Proliferativa': {
    color: '#ef4444',
    bg: '#fef2f2',
    border: '#fca5a5',
    icon: '🔴',
    label: 'Retinopatía Severa / Proliferativa',
    urgencia_color: '#dc2626',
  },
}

const SIGNO_LABELS = {
  microaneurismas: 'Microaneurismas',
  hemorragias: 'Hemorragias retinianas',
  exudados_duros: 'Exudados duros',
  exudados_blandos: 'Exudados blandos (algodón)',
  neovascularizacion: 'Neovascularización',
  edema_macular: 'Edema macular',
}

const parseArraySafe = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const parseObjectSafe = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null
    } catch {
      return null
    }
  }
  return null
}

export default function ReportesPdfPaciente() {
  const { pacienteId } = useParams()
  const navigate = useNavigate()

  const [paciente, setPaciente] = useState(null)
  const [historial, setHistorial] = useState([])
  const [seleccion, setSeleccion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [descargando, setDescargando] = useState(false)
  const [tipoDescarga, setTipoDescarga] = useState(null)
  const [imagenBlobUrl, setImagenBlobUrl] = useState(null)

  useEffect(() => {
    setCargando(true)
    Promise.all([api.get(`/pacientes/${pacienteId}`), api.get(`/historial/${pacienteId}`)])
      .then(([pRes, hRes]) => {
        setPaciente(pRes.data)
        // Importante: el backend ya ordena por fecha_analisis desc.
        // Evitamos re-ordenar en frontend para que "lo más reciente" coincida
        // exactamente con la lista y con el análisis seleccionado por defecto.
        const arr = Array.isArray(hRes.data) ? hRes.data : []
        setHistorial(arr)
        setSeleccion(arr[0] || null)
      })
      .finally(() => setCargando(false))
  }, [pacienteId])

  const nombrePaciente = useMemo(() => {
    if (!paciente) return 'Paciente'
    return `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim() || 'Paciente'
  }, [paciente])

  const descargarBlob = (blob, nombre) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nombre
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }

  const descargarHistorialPdf = async () => {
    setDescargando(true)
    setTipoDescarga('historial')
    try {
      const res = await api.get(`/historial/paciente/${pacienteId}/pdf`, { responseType: 'blob' })
      descargarBlob(res.data, `historial-retina-${paciente?.dni || pacienteId}.pdf`)
    } finally {
      setDescargando(false)
      setTipoDescarga(null)
    }
  }

  const descargarAnalisisSeleccionadoPdf = async () => {
    if (!rep?.id) return
    setDescargando(true)
    setTipoDescarga('seleccionado')
    try {
      const res = await api.get(`/historial/${rep.id}/pdf`, { responseType: 'blob' })
      descargarBlob(res.data, `informe-retina-${rep.id}.pdf`)
    } finally {
      setDescargando(false)
      setTipoDescarga(null)
    }
  }

  const rep = seleccion
  const img = rep?.imagen
  const cfg = rep ? NIVEL_CONFIG[rep.clasificacion] || NIVEL_CONFIG['Sin RD'] : null

  useEffect(() => {
    let activo = true
    let objectUrl = null

    const cargarImagen = async () => {
      if (!rep?.id) {
        setImagenBlobUrl(null)
        return
      }
      try {
        const res = await api.get(`/historial/${rep.id}/imagen`, { responseType: 'blob' })
        objectUrl = window.URL.createObjectURL(res.data)
        if (activo) setImagenBlobUrl(objectUrl)
      } catch {
        if (activo) setImagenBlobUrl(null)
      }
    }

    cargarImagen()

    return () => {
      activo = false
      if (objectUrl) window.URL.revokeObjectURL(objectUrl)
    }
  }, [rep?.id])

  const imagenSrc = imagenBlobUrl
  const hallazgos = parseArraySafe(img?.hallazgos)
  const signos = parseObjectSafe(img?.signos_rd)
  const recomendacion = img?.recomendacion || 'No disponible'

  const formatFecha = (iso) =>
    iso
      ? new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : '—'

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <button onClick={() => navigate('/reportes-pdf')} style={s.backBtn}>← Volver a Reportes PDF</button>
          <h2 style={s.title}>Reportes PDF — {nombrePaciente}</h2>
          <div style={s.meta}>DNI: {paciente?.dni || '—'} · {historial.length} análisis</div>
        </div>

        <div style={s.headerActions}>
          <button
            style={s.btnSecondary}
            disabled={!rep?.id || descargando}
            onClick={descargarAnalisisSeleccionadoPdf}
          >
            {descargando && tipoDescarga === 'seleccionado'
              ? 'Generando PDF del análisis...'
              : 'Descargar análisis seleccionado (PDF)'}
          </button>
          <button style={s.btnPrimary} disabled={!historial.length || descargando} onClick={descargarHistorialPdf}>
            {descargando && tipoDescarga === 'historial'
              ? 'Generando PDF completo...'
              : 'Descargar historial completo (PDF)'}
          </button>
        </div>
      </div>

      {cargando ? (
        <div style={s.loading}>Cargando análisis…</div>
      ) : (
        <div style={s.grid}>
          <div style={s.left}>
            <div style={s.leftTitle}>Análisis registrados</div>
            {historial.map((h) => (
              <button
                key={h.id}
                onClick={() => setSeleccion(h)}
                style={{
                  ...s.row,
                  ...(seleccion?.id === h.id ? s.rowActive : null),
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={s.rowDate}>{formatFecha(h.fecha_analisis)}</div>
                  <div style={s.rowBadge}>{h.urgencia}</div>
                </div>
                <div style={s.rowClass}>{h.clasificacion}</div>
                <div style={s.rowSmall}>Confianza: <strong>{h.nivel_confianza}</strong></div>
              </button>
            ))}
          </div>

          <div style={s.right}>
            {!rep || !cfg ? (
              <div style={s.empty}>Selecciona un análisis para ver el detalle.</div>
            ) : (
              <>
                <div style={{ ...s.mainBox, background: cfg.bg, border: `2px solid ${cfg.border}` }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ fontSize: 30 }}>{cfg.icon}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: cfg.color }}>{cfg.label}</div>
                      <div style={{ marginTop: 2, fontSize: 12, color: '#64748b' }}>
                        Confianza: <strong>{rep.nivel_confianza}</strong> • Urgencia:{' '}
                        <strong style={{ color: cfg.urgencia_color }}>{rep.urgencia}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={s.twoCol}>
                  <div style={s.card}>
                    <div style={s.cardLabel}>Imagen guardada</div>
                    {imagenSrc ? (
                      <img src={imagenSrc} alt="Retinografía" style={s.image} />
                    ) : (
                      <div style={s.muted}>No hay imagen asociada.</div>
                    )}
                  </div>

                  <div style={s.card}>
                    <div style={s.cardLabel}>Recomendación</div>
                    <div style={s.reco}>{recomendacion}</div>
                  </div>
                </div>

                {signos && (
                  <div style={s.card}>
                    <div style={s.cardLabel}>Signos detectados</div>
                    <div style={s.signosGrid}>
                      {Object.entries(signos).map(([k, v]) => (
                        <div key={k} style={s.signoItem}>
                          <span style={{ ...s.dot, background: v ? '#ef4444' : '#22c55e' }} />
                          <span style={{ color: v ? '#1e293b' : '#94a3b8', fontWeight: v ? 700 : 500 }}>
                            {SIGNO_LABELS[k] || k}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hallazgos.length > 0 && (
                  <div style={s.card}>
                    <div style={s.cardLabel}>Hallazgos observados</div>
                    <ul style={s.listUl}>
                      {hallazgos.map((h, i) => (
                        <li key={i} style={s.li}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </>
            )}
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
    padding: '28px 32px 44px',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' },
  backBtn: { border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 10 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' },
  meta: { marginTop: 6, color: '#64748b', fontSize: 13 },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  btnPrimary: { border: 'none', borderRadius: 10, padding: '10px 14px', background: '#1e3a5f', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13 },
  btnSecondary: { border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 14px', background: '#fff', color: '#1e3a5f', cursor: 'pointer', fontWeight: 700, fontSize: 13 },
  loading: { marginTop: 22, padding: 18, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, color: '#64748b' },
  grid: { marginTop: 18, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' },
  left: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' },
  leftTitle: { fontSize: 11, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 },
  row: { width: '100%', textAlign: 'left', border: '1px solid #e2e8f0', background: '#fff', borderRadius: 12, padding: 12, cursor: 'pointer', marginBottom: 10 },
  rowActive: { border: '1px solid #1e3a5f', background: '#f8fafc' },
  rowDate: { fontSize: 12, color: '#475569', fontWeight: 700 },
  rowBadge: { fontSize: 11, color: '#475569', background: '#f1f5f9', borderRadius: 999, padding: '3px 8px', fontWeight: 800, whiteSpace: 'nowrap' },
  rowClass: { marginTop: 6, fontSize: 13, fontWeight: 800, color: '#1e293b' },
  rowSmall: { marginTop: 4, fontSize: 12, color: '#64748b' },
  right: { display: 'grid', gap: 14 },
  mainBox: { borderRadius: 16, padding: '16px 18px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 },
  cardLabel: { fontSize: 11, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 },
  image: { width: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc' },
  reco: { fontSize: 13, lineHeight: 1.6, color: '#1e40af', background: '#eff6ff', border: '1px solid #bfdbfe', padding: 12, borderRadius: 12 },
  signosGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px' },
  signoItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
  dot: { width: 9, height: 9, borderRadius: 999 },
  listUl: { margin: 0, paddingLeft: 18 },
  li: { fontSize: 13, color: '#334155', marginBottom: 6, lineHeight: 1.55 },
  muted: { fontSize: 13, color: '#64748b', lineHeight: 1.6 },
  empty: { padding: 18, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, color: '#64748b' },
}

