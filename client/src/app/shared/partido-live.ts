import { Injectable, signal } from '@angular/core';

export interface EventoPartido {
  minuto: number;
  tipo: 'gol' | 'amarilla' | 'roja' | 'remate_fuera' | 'parada';
  jugador: string;
  asistencia?: string;
  equipo: 'propio' | 'rival';
  descripcion: string;
}

export interface EstadisticasEquipo {
  disparos: number;
  tirosPuerta: number;
  corners: number;
  faltas: number;
  fueraDeJuego: number;
  amarillas: number;
  rojas: number;
  posesion: number;
}

export interface EstadisticasPartido {
  propio: EstadisticasEquipo;
  rival: EstadisticasEquipo;
}

export interface ResultadoSimulado {
  rival: string;
  escudoRival?: string;
  resultado: string;
  nivelEquipo: number;
  nivelRival: number;
  descuentoPrimeraParte?: number;
  descuentoSegundaParte?: number;
  eventos: EventoPartido[];
  goleadores: string[];
  premio?: number;
  progresiones?: ProgresionJugador[];
  monedasActuales?: number;
  estadisticas?: EstadisticasPartido;
  estadisticasPrimeraParte?: EstadisticasPartido;
}

export interface ProgresionJugador {
  jugador: string;
  stats: { nombre: string; antes: number; despues: number }[];
}

@Injectable({ providedIn: 'root' })


export class PartidoLive {

  rival = signal<string>('');
  minutoActual = signal<number>(0);
  golesPropios = signal<number>(0);
  golesRival = signal<number>(0);
  eventosMostrados = signal<EventoPartido[]>([]);
  finalizado = signal<boolean>(false);
  reproduciendo = signal<boolean>(false);
  enDescanso = signal<boolean>(false);
  descuentoPrimeraParte = signal<number>(0);
  descuentoSegundaParte = signal<number>(0);
  premio = signal<number>(0);
  progresiones = signal<ProgresionJugador[]>([]);
  monedasActuales = signal<number>(0);

  private eventosPendientes: EventoPartido[] = [];
  private intervalId: any = null;
  estadisticas = signal<EstadisticasPartido | null>(null);
  estadisticasPrimeraParte = signal<EstadisticasPartido | null>(null);
  escudoRival = signal<string>('');

  iniciarPartido(resultado: ResultadoSimulado): void {
    this.rival.set(resultado.rival);
    this.minutoActual.set(0);
    this.golesPropios.set(0);
    this.golesRival.set(0);
    this.eventosMostrados.set([]);
    this.finalizado.set(false);
    this.enDescanso.set(false);
    this.premio.set(resultado.premio ?? 0);
    this.descuentoPrimeraParte.set(resultado.descuentoPrimeraParte ?? 0);
    this.descuentoSegundaParte.set(resultado.descuentoSegundaParte ?? 0);
    this.eventosPendientes = [...resultado.eventos].sort((a, b) => a.minuto - b.minuto);
    this.reproduciendo.set(true);
    this.progresiones.set(resultado.progresiones ?? []);
    this.monedasActuales.set(resultado.monedasActuales ?? 0);
    this.estadisticas.set(resultado.estadisticas ?? null);
    this.estadisticasPrimeraParte.set(resultado.estadisticasPrimeraParte ?? null);
    this.escudoRival.set(resultado.escudoRival ?? '');
 if (this.intervalId) clearInterval(this.intervalId);
    this.arrancarIntervalo();
  }


  private arrancarIntervalo(): void {
    this.intervalId = setInterval(() => {
      const minutoSiguiente = this.minutoActual() + 1;
      this.minutoActual.set(minutoSiguiente);

      while (this.eventosPendientes.length > 0 && this.eventosPendientes[0].minuto <= minutoSiguiente) {
        const evento = this.eventosPendientes.shift()!;
        this.eventosMostrados.update(lista => [...lista, evento]);
        if (evento.tipo === 'gol') {
          if (evento.equipo === 'propio') this.golesPropios.update(g => g + 1);
          else this.golesRival.update(g => g + 1);
        }
      }

      // Pausa automática al llegar al descanso
      if (minutoSiguiente === 45) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.reproduciendo.set(false);
        this.enDescanso.set(true); // ← nuevo
        return;
      }

      if (minutoSiguiente >= 90) {
        this.detener();
        this.finalizado.set(true);
      }
    }, 400);
  }

  continuarSegundaParte(): void { // ← nuevo
    this.enDescanso.set(false);
    this.reproduciendo.set(true);
    this.arrancarIntervalo();
  }

  detener(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.reproduciendo.set(false);
  }
}
