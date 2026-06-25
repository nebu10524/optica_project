// Helpers de formato reutilizados en varias páginas.

// Iniciales a partir de nombre y apellido (ej: "Andy", "Torres" -> "AT").
export const iniciales = (nombre, apellido) =>
  `${nombre?.[0] || ''}${apellido?.[0] || ''}`.toUpperCase()

// Fecha corta: 22 may 2026
export const formatFecha = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

// Fecha con hora: 22 may 2026, 15:30
export const formatFechaHora = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'
