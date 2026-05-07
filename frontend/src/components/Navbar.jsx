import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    {
      to: '/',
      label: 'Dashboard',
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      to: '/pacientes',
      label: 'Pacientes',
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  // Iniciales del usuario para el avatar
  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .nav-link-item {
          transition: background 0.18s, color 0.18s;
        }
        .nav-link-item:hover {
          background: #eef2ff !important;
          color: #1e3a5f !important;
        }
        .logout-btn {
          transition: background 0.18s, color 0.18s, border-color 0.18s;
        }
        .logout-btn:hover {
          background: #f8fafc !important;
          border-color: #e2e8f0 !important;
          color: #475569 !important;
        }
        .avatar-wrap {
          transition: opacity 0.18s;
        }
        .avatar-wrap:hover { opacity: 0.85; }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-menu { display: none !important; }
          .hamburger { display: none !important; }
        }
      `}</style>

      <nav style={s.navbar}>
        <div style={s.inner}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={s.logoRow}>
              <svg width="42" height="42" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" fill="#1e3a5f" />
                <circle cx="26" cy="28" r="10" fill="white" />
                <circle cx="26" cy="28" r="5.5" fill="#1e3a5f" />
                <circle cx="28" cy="26" r="1.8" fill="white" />
                <path d="M10 20 Q15 10 26 10 Q37 10 42 20" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M10 20 Q14 8 17 18" stroke="#C0392B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <div style={s.logoTop}>
                  <span style={s.logoMulti}>Multi</span>
                  <svg width="30" height="13" viewBox="0 0 34 15" fill="none">
                    <rect x="1" y="3" width="14" height="9" rx="4.5" stroke="white" strokeWidth="1.6" />
                    <rect x="19" y="3" width="14" height="9" rx="4.5" stroke="white" strokeWidth="1.6" />
                    <line x1="15" y1="7.5" x2="19" y2="7.5" stroke="white" strokeWidth="1.6" />
                  </svg>
                </div>
                <div style={s.logoOpticas}>ÓPTICAS</div>
              </div>
            </div>
          </Link>

          {/* ── Links desktop ── */}
          <div className="nav-desktop" style={s.navLinks}>
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="nav-link-item"
                style={{
                  ...s.navLink,
                  background: isActive(to) ? '#eef2ff' : 'transparent',
                  color: isActive(to) ? '#1e3a5f' : '#64748b',
                  fontWeight: isActive(to) ? 600 : 400,
                }}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          {/* ── Usuario + logout desktop ── */}
          <div className="nav-desktop" style={s.userArea}>
            {/* Avatar + nombre */}
            <div className="avatar-wrap" style={s.userInfo}>
              <div style={s.avatar}>{iniciales}</div>
              <div>
                <div style={s.userName}>{usuario?.nombre || 'Usuario'}</div>
                <div style={s.userRole}>Optometrista</div>
              </div>
            </div>

            {/* Separador */}
            <div style={s.sep} />

            {/* Cerrar sesión */}
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={s.logoutBtn}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cerrar sesión
            </button>
          </div>

          {/* ── Hamburger mobile ── */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={s.hamburger}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4"  y2="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6"  x2="19" y2="6"  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="19" y2="16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

        </div>

        {/* ── Menú mobile desplegable ── */}
        {menuOpen && (
          <div className="nav-mobile-menu" style={s.mobileMenu}>
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  ...s.mobileLink,
                  background: isActive(to) ? '#eef2ff' : 'transparent',
                  color: isActive(to) ? '#1e3a5f' : '#64748b',
                }}
              >
                {icon} {label}
              </Link>
            ))}
            <div style={{ ...s.sep, margin: '8px 0', width: '100%' }} />
            <div style={{ ...s.userInfo, marginBottom: 12 }}>
              <div style={s.avatar}>{iniciales}</div>
              <div>
                <div style={s.userName}>{usuario?.nombre || 'Usuario'}</div>
                <div style={s.userRole}>Optometrista</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{ ...s.logoutBtn, width: '100%', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>
    </>
  )
}

const s = {
  navbar: {
    background: '#ffffff',
    boxShadow: 'none',
    borderBottom: '1px solid #e2e8f0',
    backdropFilter: 'blur(6px)',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 28px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoTop: { display: 'flex', alignItems: 'center', gap: 6 },
  logoMulti:   { fontSize: 16, fontWeight: 700, color: '#1e3a5f', letterSpacing: '-0.3px' },
  logoOpticas: { fontSize: 18, fontWeight: 800, color: '#1e3a5f', letterSpacing: 3, lineHeight: 1.1 },

  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginLeft: 24,
  },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '7px 14px', borderRadius: 8,
    fontSize: 13, textDecoration: 'none',
    letterSpacing: '0.2px',
  },

  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  userInfo: {
    display: 'flex', alignItems: 'center', gap: 10, cursor: 'default',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: '#dbeafe',
    border: '1px solid #bfdbfe',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#1e40af', letterSpacing: '0.5px',
    flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.2 },
  userRole: { fontSize: 10, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' },

  sep: {
    width: '0.5px', height: 28,
    background: '#e2e8f0',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '7px 14px', borderRadius: 8,
    background: 'transparent',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: 12, fontWeight: 500, cursor: 'pointer',
    letterSpacing: '0.2px',
  },

  hamburger: {
    background: 'transparent', border: 'none',
    cursor: 'pointer', padding: 4,
    display: 'none',
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column',
    padding: '12px 20px 16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    gap: 4,
  },
  mobileLink: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 12px', borderRadius: 8,
    fontSize: 13, textDecoration: 'none', fontWeight: 500,
  },
}