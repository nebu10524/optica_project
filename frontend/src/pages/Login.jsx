import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={st.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .login-bg-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(30,58,95,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,58,95,0.08) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(circle at center, black 46%, transparent 96%);
        }
        .login-bg-wave {
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
          background-size: auto;
          background-position: center;
        }
        .login-input {
          width: 100%;
          height: 46px;
          border: 1px solid #d5dce8;
          border-radius: 6px;
          padding: 0 42px 0 40px;
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        }
        .login-input:focus {
          border-color: #1e3a5f;
          box-shadow: 0 0 0 3px rgba(30,58,95,0.12);
        }
        .login-input::placeholder { color: #9aa7bd; }
        .btn-login {
          transition: filter 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
        }
        .btn-login:hover:not(:disabled) {
          filter: brightness(1.04);
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(15,23,42,0.16);
        }
        .show-pass-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #98a3b9;
          transition: color 0.15s;
        }
        .show-pass-btn:hover { color: #1e3a5f; }
        @media (max-width: 920px) {
          .login-shell { grid-template-columns: 1fr !important; }
          .login-side { min-height: 180px !important; }
        }
      `}</style>

      <div className="login-bg-grid" aria-hidden="true" />
      <div className="login-bg-wave" aria-hidden="true" />

      <div className="login-shell" style={st.shell}>
        <aside className="login-side" style={st.side}>
          <div>
            <div style={st.sideBrand}>MULTI OPTICAS</div>
            <div style={st.sideLine} />
            <h2 style={st.sideTitle}>Portal Clínico Corporativo</h2>
            <p style={st.sideText}>
              Acceso seguro para gestión de pacientes, análisis de retina y reportes clínicos.
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

          <p style={st.title}>Iniciar sesión</p>
          <p style={st.subtitle}>Ingresa tus credenciales institucionales</p>

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

          <form onSubmit={handleSubmit}>
            <div style={st.group}>
              <label htmlFor="login-email" style={st.label}>Correo electrónico</label>
              <div style={{ position: 'relative' }}>
                <svg style={st.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M2 4.5l6 4 6-4" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@optica.com"
                  required
                />
              </div>
            </div>

            <div style={st.group}>
              <label htmlFor="login-password" style={st.label}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <svg style={st.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="#94a3b8" strokeWidth="1.2" />
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="8" cy="10.5" r="1" fill="#94a3b8" />
                </svg>
                <input
                  id="login-password"
                  className="login-input"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-login" style={{ ...st.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div style={st.footer}>Sistema Clínico · Multi Ópticas</div>
        </div>
      </div>
    </div>
  )
}

const st = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #f4f7fb 0%, #eef3f9 45%, #f7f9fc 100%)',
    isolation: 'isolate',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    padding: '24px',
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
    minHeight: 560,
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
  card: { background: '#ffffff', padding: '24px 28px 22px' },
  head: { paddingBottom: 12, borderBottom: '1px solid #e7edf5' },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandText: { fontSize: 18, fontWeight: 800, color: '#1e3a5f', lineHeight: 1.1 },
  brandSub: { fontSize: 10, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 },
  title: { fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '16px 0 4px' },
  subtitle: { fontSize: 13, color: '#64748b', margin: '0 0 22px' },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fdf2f2',
    border: '0.5px solid #f5c6c6',
    borderRadius: 9,
    padding: '10px 14px',
    marginBottom: 20,
    fontSize: 13,
    color: '#A32D2D',
  },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#7b8aa3', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 7 },
  inputIcon: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  btn: {
    width: '100%',
    height: 46,
    background: 'linear-gradient(90deg, #163155 0%, #1e3a5f 100%)',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    boxShadow: '0 8px 18px rgba(15,23,42,0.14)',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 14px' },
  dividerLine: { flex: 1, height: '1px', background: '#e7edf5' },
  dividerText: { fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 500 },
  btnRegistro: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 44,
    background: '#f8fafc',
    border: '1px solid #d5dce8',
    borderRadius: 6,
    color: '#1e3a5f',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.18s, border-color 0.18s',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  footer: { marginTop: 22, paddingTop: 16, borderTop: '1px solid #e7edf5', textAlign: 'center', fontSize: 11, color: '#8ea0bb' },
}