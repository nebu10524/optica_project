// Constantes clínicas de retinopatía diabética compartidas por la app.
// Centralizadas aquí para evitar duplicación entre el componente de análisis,
// el historial y los reportes PDF.

// Configuración visual + textos por clasificación de retinopatía.
export const NIVEL_CONFIG = {
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

// Etiquetas legibles de cada signo de retinopatía diabética.
export const SIGNO_LABELS = {
  microaneurismas: 'Microaneurismas',
  hemorragias: 'Hemorragias retinianas',
  exudados_duros: 'Exudados duros',
  exudados_blandos: 'Exudados blandos (algodón)',
  neovascularizacion: 'Neovascularización',
  edema_macular: 'Edema macular',
}

// Colores de la insignia (badge) de clasificación usada en tablas/listados.
// Tono más suave que NIVEL_CONFIG, pensado para etiquetas compactas.
export const CLASIFICACION_BADGE = {
  'Sin RD': { color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
  Leve: { color: '#ca8a04', bg: '#fef9c3', border: '#fde68a' },
  Moderada: { color: '#ea580c', bg: '#ffedd5', border: '#fdba74' },
  'Severa/Proliferativa': { color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
}

export const CLASIFICACION_BADGE_DEFAULT = {
  color: '#64748b',
  bg: '#f1f5f9',
  border: '#e0e6ef',
}

export const getClasificacionBadge = (valor) =>
  CLASIFICACION_BADGE[valor] || CLASIFICACION_BADGE_DEFAULT
