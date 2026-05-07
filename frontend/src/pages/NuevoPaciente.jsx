import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function NuevoPaciente() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '',
    telefono: '', email: '', fecha_nacimiento: '', genero: ''
  })
  const [error,   setError]   = useState('')
  const [exito,   setExito]   = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/pacientes', form)
      setExito(true)
      setTimeout(() => navigate('/pacientes'), 1600)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el paciente.')
    } finally {
      setLoading(false)
    }
  }

  // Preview de iniciales en tiempo real
  const iniciales = `${form.nombre?.[0] || ''}${form.apellido?.[0] || ''}`.toUpperCase()

  const campos = [
    { name: 'nombre',          label: 'Nombre',            type: 'text',   required: true,  placeholder: 'Ej: Juan',         col: 1 },
    { name: 'apellido',        label: 'Apellido',          type: 'text',   required: true,  placeholder: 'Ej: Pérez',        col: 1 },
    { name: 'dni',             label: 'DNI',               type: 'text',   required: false, placeholder: 'Ej: 12345678',     col: 1 },
    { name: 'telefono',        label: 'Teléfono',          type: 'text',   required: false, placeholder: 'Ej: 987654321',    col: 1 },
    { name: 'email',           label: 'Correo electrónico',type: 'email',  required: false, placeholder: 'Ej: juan@mail.com',col: 2 },
    { name: 'fecha_nacimiento',label: 'Fecha de nacimiento',type: 'date', required: false, placeholder: '',                  col: 1 },
  ]

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .field-input {
          width: 100%; height: 44px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0 14px;
          font-size: 14px;
          color: #1e293b;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Sora', system-ui, sans-serif;
        }
        .field-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }
        .field-input::placeholder { color: #94a3b8; }
        .field-select {
          width: 100%; height: 44px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0 14px;
          font-size: 14px;
          color: #1e293b;
          background: #fff;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Sora', system-ui, sans-serif;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        .field-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }
        .field-input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.4; cursor: pointer;
        }
        .btn-submit {
          transition: filter 0.18s, transform 0.15s, opacity 0.18s;
        }
        .btn-submit:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        .btn-cancel {
          transition: background 0.18s, color 0.18s;
        }
        .btn-cancel:hover {
          background: #e8edf3 !important;
        }
      `}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <button onClick={() => navigate('/pacientes')} style={s.backBtn}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver a pacientes
        </button>
        <div style={s.pageTag}>Registro</div>
        <h2 style={s.pageTitle}>Nuevo paciente</h2>
        <p style={s.pageSub}>Completa los datos para registrar un nuevo paciente en el sistema</p>
      </div>

      <div style={s.layout}>

        {/* ── Panel izquierdo: preview ── */}
        <div style={s.sidePanel}>
          <div style={s.avatarCard}>
            <div style={{
              ...s.avatarBig,
              background: iniciales ? '#0d4fa0' : '#e8edf3',
              color: iniciales ? '#fff' : '#94a3b8',
            }}>
              {iniciales || (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M5 28c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div style={s.previewName}>
              {form.nombre || form.apellido
                ? `${form.nombre} ${form.apellido}`.trim()
                : <span style={{ color: '#c0c8d4' }}>Nombre del paciente</span>
              }
            </div>
            {form.dni && (
              <div style={s.previewDni}>DNI: {form.dni}</div>
            )}
            {form.genero && (
              <div style={s.previewChip}>
                {{ M: 'Masculino', F: 'Femenino', otro: 'Otro' }[form.genero]}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={s.infoBox}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
              Campos requeridos
            </div>
            {[
              { label: 'Nombre',   done: !!form.nombre },
              { label: 'Apellido', done: !!form.apellido },
            ].map(({ label, done }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: done ? '#dcfce7' : '#f1f5f9',
                  border: `1.5px solid ${done ? '#22c55e' : '#e0e6ef'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {done && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13, color: done ? '#22c55e' : '#94a3b8', fontWeight: done ? 600 : 400 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Formulario ── */}
        <div style={s.formCard}>

          {/* Alertas */}
          {error && (
            <div style={s.alertError}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#A32D2D" strokeWidth="1.2" />
                <line x1="8" y1="5" x2="8" y2="8.5" stroke="#A32D2D" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.8" fill="#A32D2D" />
              </svg>
              {error}
            </div>
          )}
          {exito && (
            <div style={s.alertSuccess}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#166534" strokeWidth="1.2" />
                <path d="M5 8l2 2 4-4" stroke="#166534" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Paciente registrado correctamente. Redirigiendo...
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Sección: Datos personales */}
            <div style={s.section}>
              <div style={s.sectionLabel}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5.5" r="3" stroke="#0d4fa0" strokeWidth="1.4" />
                  <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0d4fa0" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Datos personales
              </div>
              <div style={s.grid2}>
                {campos.filter(c => c.col === 1).map(({ name, label, type, required, placeholder }) => (
                  <div key={name} style={s.fieldGroup}>
                    <label style={s.label}>
                      {label}
                      {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
                    </label>
                    <input
                      className="field-input"
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required={required}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sección: Contacto */}
            <div style={s.section}>
              <div style={s.sectionLabel}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#0d4fa0" strokeWidth="1.4" />
                  <path d="M2 4.5l6 4 6-4" stroke="#0d4fa0" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Contacto
              </div>
              <div style={s.grid1}>
                {campos.filter(c => c.col === 2).map(({ name, label, type, required, placeholder }) => (
                  <div key={name} style={s.fieldGroup}>
                    <label style={s.label}>
                      {label}
                      {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
                    </label>
                    <input
                      className="field-input"
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required={required}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sección: Género */}
            <div style={s.section}>
              <div style={s.sectionLabel}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#0d4fa0" strokeWidth="1.4" />
                  <line x1="8" y1="4" x2="8" y2="12" stroke="#0d4fa0" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="4" y1="8" x2="12" y2="8" stroke="#0d4fa0" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Información adicional
              </div>
              <div style={s.grid2}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Género</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      className="field-select"
                      name="genero"
                      value={form.genero}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar género</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '0.5px', background: '#e8edf3', margin: '4px 0 24px' }} />

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={loading || exito}
                className="btn-submit"
                style={{
                  ...s.btnSubmit,
                  opacity: loading || exito ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                      <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Registrando...
                  </>
                ) : exito ? (
                  <>✓ Registrado</>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Registrar paciente
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/pacientes')}
                style={s.btnCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
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
  header: { marginBottom: 28 },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 13, color: '#64748b', fontWeight: 500,
    padding: '0 0 14px', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    transition: 'color 0.15s',
  },
  pageTag: {
    fontSize: 11, fontWeight: 600, color: '#94a3b8',
    background: '#ffffff', display: 'inline-block',
    padding: '3px 12px', borderRadius: 20,
    letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8,
    border: '1px solid #e2e8f0',
  },
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#1e293b', margin: '0 0 4px' },
  pageSub:   { fontSize: 13, color: '#64748b', margin: 0 },

  layout: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    gap: 24,
    alignItems: 'flex-start',
    maxWidth: 860,
  },

  // Side panel
  sidePanel: { display: 'flex', flexDirection: 'column', gap: 16 },
  avatarCard: {
    background: '#ffffff',
    borderRadius: 16,
    padding: '28px 20px 24px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  avatarBig: {
    width: 72, height: 72, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, fontWeight: 800, letterSpacing: '1px',
    margin: '0 auto 16px',
    transition: 'background 0.3s',
  },
  previewName: {
    fontSize: 15, fontWeight: 700, color: '#1e293b',
    marginBottom: 6, lineHeight: 1.3,
  },
  previewDni: {
    fontSize: 11, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 8,
  },
  previewChip: {
    display: 'inline-block',
    background: '#eff6ff', color: '#1d4ed8',
    fontSize: 11, fontWeight: 600,
    padding: '3px 12px', borderRadius: 20,
    letterSpacing: '0.5px',
  },
  infoBox: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '18px 16px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
  },

  // Form card
  formCard: {
    background: '#ffffff',
    borderRadius: 16,
    padding: '28px 28px 24px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
  },

  // Alerts
  alertError: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fdf2f2', border: '0.5px solid #f5c6c6',
    borderRadius: 8, padding: '10px 14px',
    marginBottom: 20, fontSize: 13, color: '#A32D2D',
  },
  alertSuccess: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#f0fdf4', border: '0.5px solid #bbf7d0',
    borderRadius: 8, padding: '10px 14px',
    marginBottom: 20, fontSize: 13, color: '#166534',
  },

  // Sections
  section: { marginBottom: 24 },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: 7,
    fontSize: 11, fontWeight: 700, color: '#1e3a5f',
    letterSpacing: '1px', textTransform: 'uppercase',
    marginBottom: 14,
  },
  grid2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px',
  },
  grid1: {
    display: 'grid', gridTemplateColumns: '1fr', gap: 12,
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 11, fontWeight: 600, color: '#9db0cf',
    letterSpacing: '0.8px', textTransform: 'uppercase',
  },

  // Buttons
  btnSubmit: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#1e3a5f', color: '#fff',
    border: 'none', borderRadius: 8,
    padding: '11px 24px', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    boxShadow: '0 4px 14px rgba(13,79,160,0.25)',
  },
  btnCancel: {
    background: '#f1f5f9', color: '#64748b',
    border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '11px 20px', fontSize: 14, fontWeight: 500,
    cursor: 'pointer', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
}