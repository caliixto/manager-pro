// clasificacion.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoService } from '../../calendario/partido';

@Component({
  selector: 'app-clasificacion',
  imports: [CommonModule],
  templateUrl: './clasificacion.html',
  styleUrl: './clasificacion.css',
})
export class Clasificacion implements OnInit {
  vistaActiva = signal<'clasificacion' | 'resultados'>('clasificacion');

  clasificacion = signal<any[]>([]);
  jornadas = signal<any[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  constructor(private partidoService: PartidoService) {}

  ngOnInit() {
    this.cargarClasificacion();
    this.cargarJornadas();
  }

  cambiarVista(vista: 'clasificacion' | 'resultados') {
    this.vistaActiva.set(vista);
  }

  cargarClasificacion() {
    this.loading.set(true);
    this.partidoService.obtenerClasificacionLiga().subscribe({
      next: (response) => {
        this.clasificacion.set(response.clasificacion);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo cargar la clasificación');
        this.loading.set(false);
      }
    });
  }

  cargarJornadas() {
    this.partidoService.obtenerJornadasRivales().subscribe({
      next: (response) => this.jornadas.set(response.jornadas),
      error: (err) => console.error(err)
    });
  }

  esTuEquipo(equipo: any): boolean {
    return equipo.esUsuario === true;
  }
}