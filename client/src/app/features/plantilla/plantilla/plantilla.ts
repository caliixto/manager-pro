import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadorService, Jugador } from '../jugador';

@Component({
  selector: 'app-plantilla',
  imports: [CommonModule],
  templateUrl: './plantilla.html',
  styleUrl: './plantilla.css',
})
export class Plantilla implements OnInit {
  jugadores = signal<Jugador[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  constructor(private jugadorService: JugadorService) {}

  ngOnInit() {
    this.cargarJugadores();
  }

  cargarJugadores() {
    this.loading.set(true);
    this.jugadorService.listar().subscribe({
      next: (response) => {
        this.jugadores.set(response.jugadores);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo cargar la plantilla');
        this.loading.set(false);
      }
    });
  }

  getIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .map(palabra => palabra[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getColorEstado(valor: number): string {
    if (valor >= 70) return '#22c55e';
    if (valor >= 40) return '#eab308';
    return '#ef4444';
  }

  eliminarJugador(id: string | undefined) {
    if (!id) return;
    if (!confirm('¿Seguro que quieres eliminar este jugador?')) return;

    this.jugadorService.eliminarJugador(id).subscribe({
      next: () => {
        this.jugadores.update(actuales => actuales.filter(j => j._id !== id));
      },
      error: (err) => console.error(err)
    });
  }
}