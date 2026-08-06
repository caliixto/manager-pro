// ficha-jugador.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common'; 
import { JugadorService } from '../plantilla/jugador';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ficha-jugador',
  imports: [CommonModule, RouterLink],
  templateUrl: './ficha-jugador.html',
  styleUrl: './ficha-jugador.css'
})
export class FichaJugadorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jugadorService = inject(JugadorService);
  private location = inject(Location);

  jugador = signal<any | null>(null);
  estadisticas = signal<any | null>(null);
  historial = signal<any[]>([]);
  cargando = signal(true);
    debugInfo = signal<string>('');

 statsRadar = computed(() => {
  const j = this.jugador();
  if (!j) return [];
  const porPosicion: Record<string, string[]> = {
    POR: ['porteria', 'posicionamiento', 'determinacion', 'fisico'],
    DEF: ['defensa', 'fisico', 'posicionamiento', 'resistencia'],
    CEN: ['pase', 'vision', 'regate', 'resistencia'],
    DEL: ['tiro', 'velocidad', 'regate', 'determinacion']
  };
  const claves = porPosicion[j.posicion] ?? porPosicion['CEN'];
  return claves.map(clave => ({ nombre: clave, valor: j.stats?.[clave] ?? 0 }));
});

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.debugInfo.set(`Cargando ID: ${id}`);

    this.jugadorService.obtenerJugador(id).subscribe({
      next: (res) => this.jugador.set(res.jugador),
      error: (err) => {
        console.error('Error cargando jugador', err);
        this.debugInfo.update(t => t + `\nERROR jugador: ${err.status} - ${JSON.stringify(err.error)}`);
      }
    });

    this.jugadorService.obtenerEstadisticasJugador(id).subscribe({
      next: (res) => {
        this.estadisticas.set(res.estadisticas);
        this.historial.set(res.historial);
        this.cargando.set(false);
        this.debugInfo.update(t => t + `\nOK estadisticas: ${JSON.stringify(res.estadisticas)}`);
      },
      error: (err) => {
        console.error('Error cargando estadísticas', err);
        this.cargando.set(false);
        this.debugInfo.update(t => t + `\nERROR estadisticas: ${err.status} - ${JSON.stringify(err.error)} - URL: ${err.url}`);
      }
    });
  }

  formatearResultado(partido: any): string {
    const r = partido?.resultado;
    if (!r || r.golesPropios === null || r.golesRival === null) return '-';
    return `${r.golesPropios} - ${r.golesRival}`;
  }

  getColorStat(valor: number): string {
    if (valor >= 85) return '#22c55e'; // verde: excelente
    if (valor >= 70) return '#84cc16'; // verde-lima: bueno
    if (valor >= 50) return '#eab308'; // amarillo: medio
    return '#ef4444'; // rojo: flojo
  }

  volver() {
    this.location.back();
  }
}