import { Component, signal } from '@angular/core';
import { AuthService } from '../../../auth/auth';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { PlayerRadar } from '../../player-radar/player-radar';
import { CommonModule } from '@angular/common';
import { PartidoService, Partido } from '../../../calendario/partido';
import { JugadorService, Jugador } from '../../../plantilla/jugador';

interface Player {
  number: number;
  x: number;
  y: number;
  isGoalkeeper?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [PlayerRadar, CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  proximoPartido= signal<Partido | null>(null);
  ultimosResultados = signal<Partido[]>([]);
  totalJugadores = signal<number>(0);
  jugadorDestacado = signal<Jugador | null>(null);

  constructor(private authService: AuthService, private router: Router, private partido:PartidoService, private jugador:JugadorService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && !this.authService.wasWelcomeShown()) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `¡Bienvenido, ${user.name}!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#272C30',
        color: '#ffffff',
        iconColor: '#22c55e'
      });
      this.authService.markWelcomeAsShown();
    }
    this.cargarProximoPartido();
    this.cargarResultados();
    this.cargarJugadorDestacado();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  cargarProximoPartido() {
    this.partido.obtenerProximoPartido().subscribe({
      next: (response) => {
        this.proximoPartido.set(response.partido);
      },
      error: (err) => console.error(err)
    });

    this.jugador.listar().subscribe({
    next: (response) => {
      this.totalJugadores.set(response.jugadores.length);
    },
    error: (err) => console.error(err)
  });
  }


  cargarResultados(){
    this.partido.obtenerUltimosResultados(5).subscribe({
      next: (response)=>{
        this.ultimosResultados.set(response.resultados);
      },
      error: (err) => console.error(err)
    })
  }

  // Determinamos si fue victoria, empate o derrota
  getResultadoTipo(p: Partido): 'win' | 'draw' | 'loss' {
    const { golesPropios, golesRival } = p.resultado;
    if (golesPropios! > golesRival!) return 'win';
    if (golesPropios === golesRival) return 'draw';
    return 'loss';
  }

  getResultadoLetra(p: Partido): string {
    const tipo = this.getResultadoTipo(p);
    return tipo === 'win' ? 'W' : tipo === 'draw' ? 'D' : 'L';
  }

  players: Player[] = [
  // Portero
  { number: 1, x: 150, y: 400, isGoalkeeper: true },
  // Defensas (4)
  { number: 2, x: 50, y: 330 },
  { number: 4, x: 110, y: 340 },
  { number: 5, x: 190, y: 340 },
  { number: 3, x: 250, y: 330 },
  // Centrocampistas (3)
  { number: 6, x: 90, y: 240 },
  { number: 8, x: 150, y: 220 },
  { number: 10, x: 210, y: 240 },
  // Delanteros (3)
  { number: 7, x: 70, y: 110 },
  { number: 9, x: 150, y: 90 },
  { number: 11, x: 230, y: 110 },
];

cargarJugadorDestacado() {
  this.jugador.listar().subscribe({
    next: (response) => {
      // Por ahora, el primero de la lista. Más adelante podrías elegir el de mejor media, por ejemplo
      this.jugadorDestacado.set(response.jugadores[0] || null);
    },
    error: (err) => console.error(err)
  });
}
}
