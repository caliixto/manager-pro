import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadorService, Jugador } from '../jugador';

@Component({
  selector: 'app-plantilla',
  imports: [CommonModule],
  templateUrl: './plantilla.html',
  styleUrl: './plantilla.css',
})
export class Plantilla implements OnInit {
  jugadores: Jugador[] = [];
  loading = true;
  errorMsg = '';

  constructor(private jugadorService: JugadorService) {}

  ngOnInit() {
    console.log('ngOnInit ejecutado');
    this.cargarJugadores();
  }

  cargarJugadores() {
    console.log('cargarJugadores ejecutado'); 
    this.loading = true;
    this.jugadorService.listarJugadores().subscribe({
      next: (response) => {
      this.jugadores = response.jugadores;
      this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudo cargar la plantilla';
        this.loading = false;
      }
    });
  }

  // Genera iniciales para el avatar placeholder, ej: "Calixto Bocamba" → "CB"
  getIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .map(palabra => palabra[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  // Color según el estado físico, para la barra de progreso
  getColorEstado(valor: number): string {
    if (valor >= 70) return '#22c55e'; // verde
    if (valor >= 40) return '#eab308'; // amarillo
    return '#ef4444'; // rojo
  }

  eliminarJugador(id: string | undefined) {
    if (!id) return;
    if (!confirm('¿Seguro que quieres eliminar este jugador?')) return;

    this.jugadorService.eliminarJugador(id).subscribe({
      next: () => {
        this.jugadores = this.jugadores.filter(j => j._id !== id);
      },
      error: (err) => console.error(err)
    });
  }
}
