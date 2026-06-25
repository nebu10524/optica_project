import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import api from '../api/axios'
import { NIVEL_CONFIG, SIGNO_LABELS } from '../constants/retinopatia'

export default function AnalisisRetina({ pacienteId, nombrePaciente }) {
  const [imagen,    setImagen]    = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [cargando,  setCargando]  = useState(false)
  const [reporte,   setReporte]   = useState(null)
  const [error,     setError]     = useState(null)
  const inputRef = useRef()

  // Cuando el usuario elige una imagen, la mostramos en vista previa
  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImagen(file)
    setPreview(URL.createObjectURL(file))
    setReporte(null)
    setError(null)
  }

  // Envía la imagen al backend para que la IA la analice
  const handleAnalizar = async () => {
    if (!imagen) return
    setCargando(true)
    setError(null)
    setReporte(null)

    try {
      const formData = new FormData()
      formData.append('imagen', imagen)
      formData.append('paciente_id', pacienteId)

      // ✅ Sin slash al inicio para evitar redirect 405
      const res = await api.post('retina/analizar', formData)

      setReporte(res.data.reporte)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al analizar la imagen')
    } finally {
      setCargando(false)
    }
  }

  // Limpia todo para empezar un nuevo análisis
  const handleNuevo = () => {
    setImagen(null)
    setPreview(null)
    setReporte(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const cfg = reporte ? (NIVEL_CONFIG[reporte.clasificacion] || NIVEL_CONFIG['Sin RD']) : null

  return (
    <div style={{
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      maxWidth: 900, margin: '0 auto', padding: '24px 16px',
      color: '#1e293b'
    }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#1e293b', fontWeight: 700 }}>
          Análisis de Retinografía — IA
        </h2>
        {nombrePaciente && (
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Paciente: <strong>{nombrePaciente}</strong>
          </p>
        )}
        <p style={{
          margin: '8px 0 0', fontSize: 12, color: '#334155',
          background: '#eef2ff', padding: '8px 12px', borderRadius: 8,
          borderLeft: '3px solid #2563eb'
        }}>
          Este análisis es de apoyo diagnóstico. La decisión clínica corresponde siempre al especialista.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

        {/* Panel izquierdo — subida de imagen */}
        <div style={{ flex: '0 0 300px' }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${preview ? '#3b82f6' : '#425677'}`,
              borderRadius: 16, padding: 16, cursor: 'pointer',
              background: preview ? '#f8fbff' : '#ffffff',
              textAlign: 'center', transition: 'all 0.2s',
              width: '100%',
              font: 'inherit',
              minHeight: 260, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              borderColor: preview ? '#93c5fd' : '#cbd5e1'
            }}
          >
            {preview ? (
              <img src={preview} alt="Retinografía"
                style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 10, objectFit: 'contain' }} />
            ) : (
              <>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ marginBottom: 8, opacity: 0.95 }}>
                  <rect x="10" y="8" width="32" height="36" rx="7" stroke="#64748b" strokeWidth="2"/>
                  <path d="M26 31V18M26 18l-5 5M26 18l5 5" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="18" y1="36" x2="34" y2="36" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>
                  Haz clic para subir la retinografía
                </p>
                <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>
                  JPG, PNG — máx. 5 MB
                </p>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            onChange={handleImagen}
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={handleAnalizar}
              disabled={!imagen || cargando}
              style={{
                flex: 1, padding: '12px 0',
                background: (!imagen || cargando) ? '#94a3b8' : '#2563eb',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: (!imagen || cargando) ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {cargando ? '⏳ Analizando...' : '🔍 Analizar con IA'}
            </button>

            {(preview || reporte) && (
              <button
                onClick={handleNuevo}
                style={{
                  padding: '12px 14px', background: '#ffffff',
                  color: '#475569', border: '1px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, cursor: 'pointer'
                }}
              >
                🔄
              </button>
            )}
          </div>

          {/* Spinner */}
          {cargando && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <div style={{
                width: 40, height: 40, border: '4px solid #e2e8f0',
                borderTop: '4px solid #2563eb', borderRadius: '50%',
                animation: 'spin 1s linear infinite', margin: '0 auto'
              }} />
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
                La IA está analizando la imagen...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 12, padding: 12, background: '#fef2f2',
              border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 13
            }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Panel derecho — reporte */}
        {reporte && cfg && (
          <div style={{ flex: 1, minWidth: 280 }}>

            {/* Clasificación principal */}
            <div style={{
              background: cfg.bg, border: `2px solid ${cfg.border}`,
              borderRadius: 16, padding: '16px 20px', marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 28 }}>{cfg.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: cfg.color }}>
                    {cfg.label}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Confianza: <strong>{reporte.nivel_confianza}</strong> •
                    Urgencia: <strong style={{ color: cfg.urgencia_color }}>{reporte.urgencia}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Signos de RD */}
            <div style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 14, padding: '14px 16px', marginBottom: 14
            }}>
              <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>
                Signos detectados
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                {Object.entries(reporte.signos_rd || {}).map(([signo, presente]) => (
                  <div key={signo} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <span style={{ color: presente ? '#ef4444' : '#22c55e', fontSize: 16 }}>
                      {presente ? '●' : '○'}
                    </span>
                    <span style={{ color: presente ? '#1e293b' : '#94a3b8', fontWeight: presente ? 600 : 400 }}>
                      {SIGNO_LABELS[signo] || signo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hallazgos */}
            {reporte.hallazgos?.length > 0 && (
              <div style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 14, padding: '14px 16px', marginBottom: 14
              }}>
                <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Hallazgos observados
                </h4>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {reporte.hallazgos.map((h) => (
                    <li key={h} style={{ fontSize: 13, color: '#334155', marginBottom: 4 }}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendación */}
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: 14, padding: '14px 16px'
            }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 13, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: 1 }}>
                ⚕️ Recomendación al especialista
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
                {reporte.recomendacion}
              </p>
            </div>

            {/* Disclaimer */}
            <p style={{
              margin: '12px 0 0', fontSize: 11, color: '#94a3b8', textAlign: 'center'
            }}>
              Análisis generado por IA • Solo apoyo diagnóstico
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

AnalisisRetina.propTypes = {
  pacienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nombrePaciente: PropTypes.string,
}
