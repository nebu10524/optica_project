import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function renderContenidoBotonRegistro(loading, exito) {
  if (loading) {
    return (
      <>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
          style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="7.5" cy="7.5" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
          <path d="M7.5 1.5A6 6 0 0113.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Creando cuenta...
      </>
    )
  }
  if (exito) {
    return (
      <>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M3 7.5l3.5 3.5L12 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Cuenta creada
      </>
    )
  }
  return (
    <>
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.8" stroke="white" strokeWidth="1.4"/>
        <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="13" y1="2" x2="13" y2="6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="11" y1="4" x2="15" y2="4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      Crear cuenta
    </>
  )
}

// Pantalla para crear una cuenta nueva
export default function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmar: '',
  })
  const [error,    setError]    = useState('')
  const [exito,    setExito]    = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const navigate = useNavigate()

  // Actualiza el formulario cuando el usuario escribe en un campo
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Revisa que los datos del formulario sean correctos antes de enviarlos
  const validar = () => {
    if (!form.nombre.trim() || !form.apellido.trim())
      return 'El nombre y apellido son obligatorios.'
    if (!form.email.trim())
      return 'El correo electrónico es obligatorio.'
    if (form.password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres.'
    if (form.password !== form.confirmar)
      return 'Las contraseñas no coinciden.'
    return null
  }

  // Se ejecuta al enviar el formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Primero validamos; si hay error, lo mostramos y no enviamos
    const err = validar()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    try {
      // Pedimos al backend que cree la cuenta
      await api.post('usuarios/registro', {
        nombre:   form.nombre.trim(),
        apellido: form.apellido.trim(),
        email:    form.email.trim(),
        password: form.password,
        rol:      'optometrista',
      })
      // Mostramos éxito y redirigimos al dashboard a los 2 segundos
      setExito(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Calcula qué tan segura es la contraseña según su longitud y números
  const fuerzaPass = () => {
    const p = form.password
    if (!p) return null
    if (p.length < 6)  return { nivel: 1, texto: 'Muy corta',  color: '#dc2626', bg: '#fee2e2' }
    if (p.length < 8)  return { nivel: 2, texto: 'Débil',      color: '#d97706', bg: '#fef3c7' }
    if (p.length < 12 && /\d/.test(p)) return { nivel: 3, texto: 'Aceptable', color: '#0696D7', bg: '#e6f2fb' }
    return               { nivel: 4, texto: 'Fuerte',     color: '#16a34a', bg: '#dcfce7' }
  }
  const fuerza = fuerzaPass()

  const passwordsMatch = form.confirmar && form.password === form.confirmar
  const passwordsMismatch = form.confirmar && form.password !== form.confirmar

  return (
    <div className="registro-page" style={st.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .registro-page::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          opacity: 0.2;
          background-image:
            repeating-linear-gradient(
              135deg,
              rgba(22,49,85,0.15) 0px,
              rgba(22,49,85,0.15) 1px,
              transparent 1px,
              transparent 22px
            ),
            repeating-linear-gradient(
              45deg,
              rgba(30,58,95,0.08) 0px,
              rgba(30,58,95,0.08) 1px,
              transparent 1px,
              transparent 28px
            );
        }
        .reg-input {
          width: 100%; height: 44px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0 42px 0 40px;
          font-size: 14px; color: #1e293b;
          background: #ffffff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        }
        .reg-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.14);
        }
        .reg-input.input-ok {
          border-color: #22c55e;
        }
        .reg-input.input-err {
          border-color: #ef4444;
        }
        .reg-input::placeholder { color: #94a3b8; }
        .reg-select {
          width: 100%; height: 44px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0 40px 0 40px;
          font-size: 14px; color: #1e293b;
          background: #ffffff; outline: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        .reg-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.14);
        }
        .btn-reg {
          transition: filter 0.18s ease, transform 0.15s ease;
        }
        .btn-reg:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        .show-pass-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; padding: 4px;
          color: #94a3b8;
          transition: color 0.15s;
        }
        .show-pass-btn:hover { color: #2563eb; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 920px) {
          .registro-shell { grid-template-columns: 1fr !important; }
          .registro-side { min-height: 180px !important; }
        }
      `}</style>

      <div className="registro-shell" style={st.shell}>
        <aside className="registro-side" style={st.side}>
          <div>
            <div style={st.sideBrand}>MULTI OPTICAS</div>
            <div style={st.sideLine} />
            <h2 style={st.sideTitle}>Portal Clínico Corporativo</h2>
            <p style={st.sideText}>
              Crea una cuenta institucional para gestionar pacientes y evaluaciones visuales.
            </p>
          </div>
          <div style={st.sideFoot}>Enterprise Vision Suite</div>
        </aside>

        <div style={st.card}>

        <div style={st.head}>
          <div style={st.brandRow}>
            <svg width="32" height="32" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24" fill="#cfe0f7" />
              <circle cx="26" cy="28" r="10" fill="white" />
              <circle cx="26" cy="28" r="5.5" fill="#163155" />
              <circle cx="28" cy="26" r="1.8" fill="white" />
              <path d="M10 20 Q15 10 26 10 Q37 10 42 20" stroke="#163155" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
            <div>
              <div style={st.brandText}>Multi Ópticas</div>
              <div style={st.brandSub}>Acceso profesional</div>
            </div>
          </div>
        </div>

        {/* ── Cuerpo ── */}
        <div style={st.body}>
          <p style={st.title}>Crear nueva cuenta</p>
          <p style={st.subtitle}>Completa los datos para registrarte en el sistema</p>

          {/* Error */}
          {error && (
            <div style={st.errorBox}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#A32D2D" strokeWidth="1.2" />
                <line x1="8" y1="5" x2="8" y2="8.5" stroke="#A32D2D" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.8" fill="#A32D2D" />
              </svg>
              {error}
            </div>
          )}

          {/* Éxito */}
          {exito && (
            <div style={st.successBox}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#166534" strokeWidth="1.2" />
                <path d="M5 8l2 2 4-4" stroke="#166534" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cuenta creada exitosamente. Redirigiendo...
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Nombre y Apellido ── */}
            <div style={st.row2}>
              <div style={st.group}>
                <label htmlFor="reg-nombre" style={st.label}>
                  Nombre <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <svg style={st.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.8" stroke="#94a3b8" strokeWidth="1.2" />
                    <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
                      stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input
                    id="reg-nombre"
                    className="reg-input"
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan"
                    required
                  />
                </div>
              </div>

              <div style={st.group}>
                <label htmlFor="reg-apellido" style={st.label}>
                  Apellido <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <svg style={st.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.8" stroke="#94a3b8" strokeWidth="1.2" />
                    <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
                      stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input
                    id="reg-apellido"
                    className="reg-input"
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Ej: Pérez"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ── Email ── */}
            <div style={st.group}>
              <label htmlFor="reg-email" style={st.label}>
                Correo electrónico <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={st.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M2 4.5l6 4 6-4" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  id="reg-email"
                  className="reg-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="usuario@optica.com"
                  required
                />
              </div>
            </div>

            {/* ── Contraseña ── */}
            <div style={st.group}>
              <label htmlFor="reg-password" style={st.label}>
                Contraseña <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={st.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="8" cy="10.5" r="1" fill="#94a3b8" />
                </svg>
                <input
                  id="reg-password"
                  className="reg-input"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Indicador fuerza contraseña */}
              {fuerza && (
                <div style={{ marginTop: 8, animation: 'fadeIn 0.2s ease' }}>
                  <div style={st.fuerzaTrack}>
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} style={{
                        flex: 1, height: '100%',
                        borderRadius: 3,
                        background: n <= fuerza.nivel ? fuerza.color : '#e0e6ef',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: fuerza.color, marginTop: 4,
                    letterSpacing: '0.3px',
                  }}>
                    {fuerza.texto}
                  </div>
                </div>
              )}
            </div>

            {/* ── Confirmar contraseña ── */}
            <div style={st.group}>
              <label htmlFor="reg-confirmar" style={st.label}>
                Confirmar contraseña <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={st.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="8" cy="10.5" r="1" fill="#94a3b8" />
                </svg>
                <input
                  id="reg-confirmar"
                  className={`reg-input ${passwordsMatch ? 'input-ok' : ''} ${passwordsMismatch ? 'input-err' : ''}`}
                  type={showConf ? 'text' : 'password'}
                  name="confirmar"
                  value={form.confirmar}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  required
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowConf(v => !v)}
                  tabIndex={-1}
                >
                  {showConf ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  )}
                </button>
              </div>
              {passwordsMismatch && (
                <div style={{ fontSize: 11, color: '#dc2626', marginTop: 5, fontWeight: 500, animation: 'fadeIn 0.2s ease' }}>
                  Las contraseñas no coinciden
                </div>
              )}
              {passwordsMatch && (
                <div style={{ fontSize: 11, color: '#16a34a', marginTop: 5, fontWeight: 500, animation: 'fadeIn 0.2s ease' }}>
                  ✓ Las contraseñas coinciden
                </div>
              )}
            </div>

            {/* ── Botón submit ── */}
            <button
              type="submit"
              disabled={loading || exito}
              className="btn-reg"
              style={{ ...st.btn, opacity: loading || exito ? 0.7 : 1 }}
            >
              {renderContenidoBotonRegistro(loading, exito)}
            </button>
          </form>

          {/* ── Link a login ── */}
          <div style={st.divider}>
            <div style={st.dividerLine} />
            <span style={st.dividerText}>¿Ya tienes cuenta?</span>
            <div style={st.dividerLine} />
          </div>

          <Link to="/" style={st.btnVolver}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="#0696D7" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Iniciar sesión
          </Link>

          <div style={st.footer}>
            Sistema de Gestión Visual · Multi Ópticas
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

const st = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #f4f7fb 0%, #eef3f9 45%, #f7f9fc 100%)',
    isolation: 'isolate',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    padding: '32px 16px',
  },
  shell: {
    width: 'min(980px, 100%)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    border: '1px solid #dce4f0',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(15,23,42,0.12)',
    background: '#fff',
  },
  side: {
    background: 'linear-gradient(165deg, #10233e 0%, #1a355b 100%)',
    color: '#e5edf8',
    minHeight: 620,
    padding: '34px 30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sideBrand: { fontSize: 12, letterSpacing: '2.2px', fontWeight: 700, color: '#9fb2d4', textTransform: 'uppercase' },
  sideLine: { marginTop: 12, width: 56, height: 2, background: '#3f5f93', borderRadius: 2 },
  sideTitle: { margin: '18px 0 10px', fontSize: 30, lineHeight: 1.2, fontWeight: 800, color: '#f1f5fb' },
  sideText: { margin: 0, fontSize: 14, lineHeight: 1.65, color: '#c3d2e9', maxWidth: 360 },
  sideFoot: { fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#8ea4ca', fontWeight: 600 },
  card: {
    borderRadius: 0,
    overflow: 'hidden',
    boxShadow: 'none',
    background: '#ffffff',
    border: 'none',
  },

  head: { padding: '24px 36px 14px', borderBottom: '1px solid #e7edf5' },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandText: { fontSize: 18, fontWeight: 800, color: '#1e3a5f', lineHeight: 1.1 },
  brandSub: { fontSize: 10, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 },

  // Body
  body:     { padding: '28px 36px 24px' },
  title:    { fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 4px' },
  subtitle: { fontSize: 13, color: '#64748b', margin: '0 0 20px' },

  // Alertas
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fdf2f2', border: '0.5px solid #f5c6c6',
    borderRadius: 9, padding: '10px 14px',
    marginBottom: 16, fontSize: 13, color: '#A32D2D',
    animation: 'fadeIn 0.2s ease',
  },
  successBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#f0fdf4', border: '0.5px solid #bbf7d0',
    borderRadius: 9, padding: '10px 14px',
    marginBottom: 16, fontSize: 13, color: '#166534',
    animation: 'fadeIn 0.2s ease',
  },

  // Form
  row2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
  },
  group:    { marginBottom: 14 },
  label: {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: '#94a3b8', letterSpacing: '0.8px',
    textTransform: 'uppercase', marginBottom: 7,
  },
  inputIcon: {
    position: 'absolute', left: 13,
    top: '50%', transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  rolHint: {
    fontSize: 11, color: '#94a3b8', marginTop: 6,
    letterSpacing: '0.2px', lineHeight: 1.5,
  },

  // Fuerza contraseña
  fuerzaTrack: {
    display: 'flex', gap: 4,
    height: 4, borderRadius: 4, overflow: 'hidden',
  },

  // Botón
  btn: {
    width: '100%', height: 46,
    background: '#1e3a5f', border: 'none', borderRadius: 8,
    color: '#fff', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 20,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    boxShadow: '0 4px 14px rgba(30,58,95,0.22)',
  },

  // Divider
  divider: {
    display: 'flex', alignItems: 'center',
    gap: 10, margin: '20px 0 14px',
  },
  dividerLine: { flex: 1, height: '0.5px', background: '#e8edf3' },
  dividerText: { fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 500 },

  // Botón volver
  btnVolver: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, width: '100%', height: 44,
    background: '#ffffff', border: '1px solid #cbd5e1',
    borderRadius: 8, color: '#1e3a5f',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer', textDecoration: 'none',
    transition: 'background 0.18s, border-color 0.18s',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },

  footer: {
    marginTop: 20, paddingTop: 14,
    borderTop: '0.5px solid #e2e8f0',
    textAlign: 'center', fontSize: 11, color: '#94a3b8',
  },
}