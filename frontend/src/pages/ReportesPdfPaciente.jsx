import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { NIVEL_CONFIG, SIGNO_LABELS } from '../constants/retinopatia'
import { formatFechaHora } from '../utils/format'
import { pageBackground } from '../theme/pageStyles'

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

const getSafeNumericId = (value) => {
  const normalized = String(value ?? '')
  return /^\d+$/.test(normalized) ? normalized : null
}

export default function ReportesPdfPaciente() {
  const { pacienteId } = useParams()
  const navigate = useNavigate()
  const pacienteIdSeguro = useMemo(() => getSafeNumericId(pacienteId), [pacienteId])

  const [paciente, setPaciente] = useState(null)
  const [historial, setHistorial] = useState([])
  const [seleccion, setSeleccion] = useState(null)
  // Arranca "cargando" solo si hay un id válido que pedir; si no, no hay nada que esperar.
  const [cargando, setCargando] = useState(() => Boolean(getSafeNumericId(pacienteId)))
  const [descargando, setDescargando] = useState(false)
  const [tipoDescarga, setTipoDescarga] = useState(null)
  const [imagenBlobUrl, setImagenBlobUrl] = useState(null)

  useEffect(() => {
    if (!pacienteIdSeguro) return

    let activo = true
    Promise.all([api.get(`/pacientes/${pacienteIdSeguro}`), api.get(`/historial/${pacienteIdSeguro}`)])
      .then(([pRes, hRes]) => {
        if (!activo) return
        setPaciente(pRes.data)
        // Importante: el backend ya ordena por fecha_analisis desc.
        // Evitamos re-ordenar en frontend para que "lo más reciente" coincida
        // exactamente con la lista y con el análisis seleccionado por defecto.
        const arr = Array.isArray(hRes.data) ? hRes.data : []
        setHistorial(arr)
        setSeleccion(arr[0] || null)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [pacienteIdSeguro])

  const nombrePaciente = useMemo(() => {
    if (!paciente) return 'Paciente'
    return `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim() || 'Paciente'
  }, [paciente])

  // Descarga un archivo (blob) recibido del backend con el nombre indicado
  const descargarBlob = (blob, nombre) => {
    const url = globalThis.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nombre
    document.body.appendChild(a)
    a.click()
    a.remove()
    globalThis.URL.revokeObjectURL(url)
  }

  // Descarga el PDF con todo el historial del paciente
  const descargarHistorialPdf = async () => {
    if (!pacienteIdSeguro) return

    setDescargando(true)
    setTipoDescarga('historial')
    try {
      const res = await api.get(`/historial/paciente/${pacienteIdSeguro}/pdf`, { responseType: 'blob' })
      descargarBlob(res.data, `historial-retina-${paciente?.dni || pacienteIdSeguro}.pdf`)
    } finally {
      setDescargando(false)
      setTipoDescarga(null)
    }
  }

  // Descarga el PDF solo del análisis que está seleccionado
  const descargarAnalisisSeleccionadoPdf = async () => {
    const historialIdSeguro = getSafeNumericId(rep?.id)
    if (!historialIdSeguro) return

    setDescargando(true)
    setTipoDescarga('seleccionado')
    try {
      const res = await api.get(`/historial/${historialIdSeguro}/pdf`, { responseType: 'blob' })
      descargarBlob(res.data, `informe-retina-${historialIdSeguro}.pdf`)
    } finally {
      setDescargando(false)
      setTipoDescarga(null)
    }
  }

  const rep = seleccion
  const img = rep?.imagen
  const cfg = rep ? NIVEL_CONFIG[rep.clasificacion] || NIVEL_CONFIG['Sin RD'] : null

  // Carga la imagen del análisis seleccionado y la libera al cambiar
  useEffect(() => {
    let activo = true
    let objectUrl = null

    const cargarImagen = async () => {
      const historialIdSeguro = getSafeNumericId(rep?.id)
      if (!historialIdSeguro) {
        setImagenBlobUrl(null)
        return
      }
      try {
        const res = await api.get(`/historial/${historialIdSeguro}/imagen`, { responseType: 'blob' })
        objectUrl = globalThis.URL.createObjectURL(res.data)
        if (activo) setImagenBlobUrl(objectUrl)
      } catch {
        if (activo) setImagenBlobUrl(null)
      }
    }

    cargarImagen()

    return () => {
      activo = false
      if (objectUrl) globalThis.URL.revokeObjectURL(objectUrl)
    }
  }, [rep?.id])

  const imagenSrc = imagenBlobUrl
  const hallazgos = parseArraySafe(img?.hallazgos)
  const signos = parseObjectSafe(img?.signos_rd)
  const recomendacion = img?.recomendacion || 'No disponible'

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
                  <div style={s.rowDate}>{formatFechaHora(h.fecha_analisis)}</div>
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
                      {hallazgos.map((h) => (
                        <li key={h} style={s.li}>{h}</li>
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
    ...pageBackground,
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

