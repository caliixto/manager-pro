import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PartidoService } from '../partido';

interface JugadorConvocatoria {
  _id: string;
  nombre: string;
  posicion: string;
  foto: string;
  lesionado: boolean;
  sancionado: boolean;
  convocado: boolean;
}

@Component({
  selector: 'app-convocatoria-detalle',
  imports: [CommonModule, RouterLink],
  templateUrl: './convocatoria-detalle.html',
  styleUrl: './convocatoria-detalle.css',
})
export class ConvocatoriaDetalle implements OnInit {
  jugadores = signal<JugadorConvocatoria[]>([]);
  rival = signal<string>('');
  fecha = signal<string>('');
  loading = signal(true);
  errorMsg = signal('');

  constructor(
    private route: ActivatedRoute,
    private partidoService: PartidoService
  ) {}

  ngOnInit() {
    const partidoId = this.route.snapshot.paramMap.get('id');
    if (partidoId) {
      this.cargarConvocatoria(partidoId);
    }
  }

  cargarConvocatoria(partidoId: string) {
    this.loading.set(true);
    this.partidoService.obtenerConvocatoriaDetallada(partidoId).subscribe({
      next: (response) => {
        this.jugadores.set(response.jugadores);
        this.rival.set(response.rival);
        this.fecha.set(response.fecha);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo cargar la convocatoria');
        this.loading.set(false);
      }
    });
  }

  getIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .map(p => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getEstadoTexto(j: JugadorConvocatoria): string {
    if (j.lesionado) return 'Lesionado';
    if (j.sancionado) return 'Sancionado';
    if (j.convocado) return 'Convocado';
    return 'No convocado';
  }

  getEstadoClase(j: JugadorConvocatoria): string {
    if (j.lesionado) return 'lesionado';
    if (j.sancionado) return 'sancionado';
    if (j.convocado) return 'convocado';
    return 'no-convocado';
  }
}
