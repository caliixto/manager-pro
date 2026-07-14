import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoService, Partido } from '../partido';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  partidos = signal<Partido[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  constructor(private partidoService: PartidoService) {}

  ngOnInit() {
    this.cargarPartidos();
  }

  cargarPartidos() {
  console.log('Iniciando carga de partidos'); // 👈 nuevo
  this.loading.set(true);
  this.partidoService.listarPartidos().subscribe({
    next: (response) => {
      console.log('Respuesta recibida:', response); // 👈 nuevo
      this.partidos.set(response.partidos);
      this.loading.set(false);
    },
    error: (err) => {
      console.log('Error recibido:', err); // 👈 nuevo
      this.errorMsg.set('No se pudo cargar el calendario');
      this.loading.set(false);
    }
  });
}

  formatearFecha(fecha: string): string {
    const f = new Date(fecha);
    return f.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getResultadoTexto(partido: Partido): string {
    if (!partido.jugado) return '';
    return `${partido.resultado.golesPropios} - ${partido.resultado.golesRival}`;
  }

  getResultadoClase(partido: Partido): string {
    if (!partido.jugado) return '';
    const { golesPropios, golesRival } = partido.resultado;
    if (golesPropios! > golesRival!) return 'win';
    if (golesPropios === golesRival) return 'draw';
    return 'loss';
  }
}
