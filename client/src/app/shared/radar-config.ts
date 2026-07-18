export const ejesRadarPorPosicion: Record<string, string[]> = {
  POR: ['porteria', 'posicionamiento', 'fisico', 'determinacion'],
  DEF: ['defensa', 'fisico', 'posicionamiento', 'determinacion'],
  CEN: ['pase', 'vision', 'regate', 'resistencia'],
  DEL: ['tiro', 'aceleracion', 'regate', 'posicionamiento'],
};

// Etiquetas legibles para mostrar en el radar
export const etiquetasStats: Record<string, string> = {
  velocidad: 'Velocidad',
  aceleracion: 'Aceleración',
  fisico: 'Físico',
  resistencia: 'Resistencia',
  tiro: 'Tiro',
  pase: 'Pase',
  regate: 'Regate',
  defensa: 'Defensa',
  posicionamiento: 'Posición',
  vision: 'Visión',
  determinacion: 'Determinación',
  porteria: 'Portería',
};