import { useState, useEffect } from 'react'
import uronImg from '../assets/uron.png'

const mensajes = {
  login: [
    "¡Hola! 👋 Bienvenido/a de vuelta.",
    "Ingresa tu correo y contraseña.",
    "¿Olvidaste tu contraseña? Contacta al admin. 🔑",
    "Tus datos están seguros con nosotros. 🔒",
    "¡Casi listo! Solo un clic más. 😊",
  ],
  registro: [
    "¡Hola! Voy a ayudarte a crear tu cuenta. 🎉",
    "Usa una contraseña de al menos 6 caracteres. 🔐",
    "Verifica que las contraseñas coincidan.",
    "¡Bienvenido/a a Multi Ópticas! ✨",
    "Completa todos los campos para continuar.",
  ],
}

export default function AsistenteUron({ modo = 'login' }) {
  const [idxMsg, setIdxMsg]   = useState(0)
  const [visible, setVisible] = useState(true)
  const [cerrado, setCerrado] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdxMsg(i => (i + 1) % mensajes[modo].length)
        setVisible(true)
      }, 350)
    }, 5000)
    return () => clearInterval(id)
  }, [modo])

  const handleClick = () => {
    setVisible(false)
    setTimeout(() => {
      setIdxMsg(i => (i + 1) % mensajes[modo].length)
      setVisible(true)
    }, 300)
  }

  if (cerrado) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

        @keyframes flotar {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulsarAnillo {
          0%, 100% { box-shadow: 0 0 0 0 rgba(13, 79, 160, 0.3), 0 8px 32px rgba(13,79,160,0.2); }
          50%       { box-shadow: 0 0 0 10px rgba(13, 79, 160, 0), 0 12px 40px rgba(13,79,160,0.35); }
        }
        @keyframes entradaBurbuja {
          from { opacity: 0; transform: translateY(12px) scale(0.88); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes brilloLabel {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }

        .uron-wrapper {
          animation: flotar 3.4s ease-in-out infinite;
          cursor: pointer;
          transition: transform 0.2s ease;
          border-radius: 50%;
        }
        .uron-wrapper:hover {
          transform: scale(1.08) translateY(-5px) rotate(0deg) !important;
          animation-play-state: paused;
        }
        .uron-circle {
          background: linear-gradient(145deg, #e8f0fb, #c8d9f5);
          border-radius: 50%;
          padding: 10px;
          animation: pulsarAnillo 3s ease-in-out infinite;
          border: 2.5px solid rgba(13, 79, 160, 0.2);
        }
        .uron-img {
          width: 130px;
          display: block;
          user-select: none;
          filter: drop-shadow(0 4px 10px rgba(13,79,160,0.2));
        }
        .burbuja-outer {
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .burbuja-card {
          background: #ffffff;
          border: 2px solid #c5d5ee;
          border-radius: 18px;
          border-bottom-right-radius: 6px;
          padding: 13px 18px 13px 16px;
          font-size: 13.5px;
          font-weight: 600;
          color: #1a2540;
          line-height: 1.55;
          font-family: 'Sora', system-ui, sans-serif;
          position: relative;
          text-align: center;
          max-width: 235px;
          box-shadow:
            0 2px 8px rgba(13,79,160,0.08),
            0 8px 24px rgba(13,79,160,0.10),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .burbuja-card::before {
          content: '';
          position: absolute;
          top: 8px; left: 12px; right: 40px; bottom: 8px;
          background: linear-gradient(135deg, rgba(232,240,251,0.5) 0%, transparent 60%);
          border-radius: 12px;
          pointer-events: none;
        }
        .btn-cerrar {
          position: absolute;
          top: 7px; right: 10px;
          background: rgba(148, 163, 184, 0.15);
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #94a3b8;
          line-height: 1;
          padding: 2px 5px;
          border-radius: 50%;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
        }
        .btn-cerrar:hover {
          background: rgba(220, 50, 50, 0.12);
          color: #dc3232;
        }
        .label-opti {
          margin-top: 6px;
          padding: 4px 18px;
          border-radius: 24px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: 'Sora', system-ui, sans-serif;
          color: #fff;
          background: linear-gradient(90deg, #0d4fa0, #1a73e8, #0d4fa0);
          background-size: 200% 200%;
          animation: brilloLabel 4s ease infinite;
          box-shadow: 0 2px 10px rgba(13,79,160,0.4);
        }

        .puntito-vivo {
          position: absolute;
          top: 8px; right: 8px;
          width: 10px; height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
          animation: pingVerde 2s ease-out infinite;
        }
        @keyframes pingVerde {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70%  { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        .triangulo-wrapper {
          display: flex;
          justify-content: flex-end;
          padding-right: 28px;
          margin-top: -1px;
        }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 9999,
        gap: 0,
      }}>

        {/* Burbuja de mensaje */}
        <div
          className="burbuja-outer"
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
            marginBottom: 8,
          }}
        >
          <div className="burbuja-card">
            {mensajes[modo][idxMsg]}
            <button
              className="btn-cerrar"
              onClick={() => setCerrado(true)}
              title="Cerrar asistente"
            >×</button>
          </div>

          {/* Puntero del globo */}
          <div className="triangulo-wrapper">
            <svg width="18" height="12" viewBox="0 0 18 12" style={{ display: 'block', marginTop: -1 }}>
              <polygon points="0,0 18,0 18,12" fill="#c5d5ee" />
              <polygon points="2,0 18,0 18,10" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Hurón con círculo animado */}
        <div
          className="uron-wrapper"
          onClick={handleClick}
          title="¡Haz clic en mí!"
          style={{ position: 'relative' }}
        >
          <div className="uron-circle">
            <img
              src={uronImg}
              alt="Opti el asistente"
              className="uron-img"
            />
          </div>
          {/* Punto verde de "en línea" */}
          <div className="puntito-vivo" />
        </div>

        {/* Etiqueta */}
        <div className="label-opti">OPI</div>
      </div>
    </>
  )
}