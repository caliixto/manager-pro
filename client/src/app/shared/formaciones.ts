export interface SlotFormacion {
  posicion: 'POR' | 'DEF' | 'CEN' | 'DEL';
  top: number;
  left: number;
}

export const FORMACIONES: Record<string, SlotFormacion[]> = {

  '4-3-3': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 70, left: 15 },
    { posicion: 'DEF', top: 72, left: 38 },
    { posicion: 'DEF', top: 72, left: 62 },
    { posicion: 'DEF', top: 70, left: 85 },
    { posicion: 'CEN', top: 48, left: 25 },
    { posicion: 'CEN', top: 45, left: 50 },
    { posicion: 'CEN', top: 48, left: 75 },
    { posicion: 'DEL', top: 15, left: 20 },
    { posicion: 'DEL', top: 10, left: 50 },
    { posicion: 'DEL', top: 15, left: 80 },
  ],

  '4-4-2': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 70, left: 15 },
    { posicion: 'DEF', top: 72, left: 38 },
    { posicion: 'DEF', top: 72, left: 62 },
    { posicion: 'DEF', top: 70, left: 85 },
    { posicion: 'CEN', top: 45, left: 15 },
    { posicion: 'CEN', top: 48, left: 38 },
    { posicion: 'CEN', top: 48, left: 62 },
    { posicion: 'CEN', top: 45, left: 85 },
    { posicion: 'DEL', top: 12, left: 35 },
    { posicion: 'DEL', top: 12, left: 65 },
  ],

  '4-2-3-1': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 70, left: 15 },
    { posicion: 'DEF', top: 72, left: 38 },
    { posicion: 'DEF', top: 72, left: 62 },
    { posicion: 'DEF', top: 70, left: 85 },
    { posicion: 'CEN', top: 55, left: 35 },
    { posicion: 'CEN', top: 55, left: 65 },
    { posicion: 'CEN', top: 30, left: 20 },
    { posicion: 'CEN', top: 28, left: 50 },
    { posicion: 'CEN', top: 30, left: 80 },
    { posicion: 'DEL', top: 10, left: 50 },
  ],

  '3-5-2': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 72, left: 25 },
    { posicion: 'DEF', top: 74, left: 50 },
    { posicion: 'DEF', top: 72, left: 75 },
    { posicion: 'CEN', top: 50, left: 10 },
    { posicion: 'CEN', top: 45, left: 32 },
    { posicion: 'CEN', top: 42, left: 50 },
    { posicion: 'CEN', top: 45, left: 68 },
    { posicion: 'CEN', top: 50, left: 90 },
    { posicion: 'DEL', top: 12, left: 38 },
    { posicion: 'DEL', top: 12, left: 62 },
  ],

  '3-4-3': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 72, left: 25 },
    { posicion: 'DEF', top: 74, left: 50 },
    { posicion: 'DEF', top: 72, left: 75 },
    { posicion: 'CEN', top: 48, left: 12 },
    { posicion: 'CEN', top: 45, left: 38 },
    { posicion: 'CEN', top: 45, left: 62 },
    { posicion: 'CEN', top: 48, left: 88 },
    { posicion: 'DEL', top: 15, left: 20 },
    { posicion: 'DEL', top: 10, left: 50 },
    { posicion: 'DEL', top: 15, left: 80 },
  ],

  '4-1-4-1': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 72, left: 15 },
    { posicion: 'DEF', top: 74, left: 38 },
    { posicion: 'DEF', top: 74, left: 62 },
    { posicion: 'DEF', top: 72, left: 85 },
    { posicion: 'CEN', top: 58, left: 50 },
    { posicion: 'CEN', top: 38, left: 15 },
    { posicion: 'CEN', top: 35, left: 38 },
    { posicion: 'CEN', top: 35, left: 62 },
    { posicion: 'CEN', top: 38, left: 85 },
    { posicion: 'DEL', top: 10, left: 50 },
  ],

  '5-3-2': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 68, left: 8 },
    { posicion: 'DEF', top: 72, left: 28 },
    { posicion: 'DEF', top: 74, left: 50 },
    { posicion: 'DEF', top: 72, left: 72 },
    { posicion: 'DEF', top: 68, left: 92 },
    { posicion: 'CEN', top: 45, left: 25 },
    { posicion: 'CEN', top: 42, left: 50 },
    { posicion: 'CEN', top: 45, left: 75 },
    { posicion: 'DEL', top: 12, left: 38 },
    { posicion: 'DEL', top: 12, left: 62 },
  ],

  '4-3-1-2': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 72, left: 15 },
    { posicion: 'DEF', top: 74, left: 38 },
    { posicion: 'DEF', top: 74, left: 62 },
    { posicion: 'DEF', top: 72, left: 85 },
    { posicion: 'CEN', top: 52, left: 20 },
    { posicion: 'CEN', top: 50, left: 50 },
    { posicion: 'CEN', top: 52, left: 80 },
    { posicion: 'CEN', top: 28, left: 50 },
    { posicion: 'DEL', top: 12, left: 38 },
    { posicion: 'DEL', top: 12, left: 62 },
  ],

  '4-4-1-1': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 72, left: 15 },
    { posicion: 'DEF', top: 74, left: 38 },
    { posicion: 'DEF', top: 74, left: 62 },
    { posicion: 'DEF', top: 72, left: 85 },
    { posicion: 'CEN', top: 48, left: 15 },
    { posicion: 'CEN', top: 50, left: 38 },
    { posicion: 'CEN', top: 50, left: 62 },
    { posicion: 'CEN', top: 48, left: 85 },
    { posicion: 'DEL', top: 28, left: 50 },
    { posicion: 'DEL', top: 10, left: 50 },
  ],

  '5-4-1': [
    { posicion: 'POR', top: 90, left: 50 },
    { posicion: 'DEF', top: 68, left: 8 },
    { posicion: 'DEF', top: 72, left: 28 },
    { posicion: 'DEF', top: 74, left: 50 },
    { posicion: 'DEF', top: 72, left: 72 },
    { posicion: 'DEF', top: 68, left: 92 },
    { posicion: 'CEN', top: 42, left: 15 },
    { posicion: 'CEN', top: 45, left: 38 },
    { posicion: 'CEN', top: 45, left: 62 },
    { posicion: 'CEN', top: 42, left: 85 },
    { posicion: 'DEL', top: 10, left: 50 },
  ],

};