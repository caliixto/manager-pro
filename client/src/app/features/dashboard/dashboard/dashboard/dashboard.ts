import { Component, signal } from '@angular/core';
import { AuthService } from '../../../auth/auth';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { PlayerRadar } from '../../player-radar/player-radar';
import { CommonModule } from '@angular/common';
import { PartidoService, Partido } from '../../../calendario/partido';
import { JugadorService, Jugador } from '../../../plantilla/jugador';

interface PlayerPosicionado {
  x: number;
  y: number;
  isGoalkeeper?: boolean;
  jugador: Jugador | null;
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
  balanceTactico = signal<{ ataque: number; defensa: number; control: number }>({ ataque: 0, defensa: 0, control: 0 });
  playersEnCampo = signal<PlayerPosicionado[]>([]);

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

        if (response.partido?._id) {
          this.cargarBalanceTactico(response.partido._id);
          this.cargarTitulares(response.partido._id);
        }
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

  private posicionesCampo = [
  { x: 150, y: 400, isGoalkeeper: true }, // Portero
  { x: 50, y: 330 }, { x: 110, y: 340 }, { x: 190, y: 340 }, { x: 250, y: 330 }, // Defensas
  { x: 90, y: 240 }, { x: 150, y: 220 }, { x: 210, y: 240 }, // Centrocampistas
  { x: 70, y: 110 }, { x: 150, y: 90 }, { x: 230, y: 110 }, // Delanteros
];

  //Jugador Destacado
  cargarJugadorDestacado() {
    this.jugador.listar().subscribe({
      next: (response) => {
        // De momento, el primero de la lista
        this.jugadorDestacado.set(response.jugadores[0] || null);
      },
      error: (err) => console.error(err)
    });
  }

  //Balance Tactico
  cargarBalanceTactico(partidoId: string) {
    this.partido.obtenerBalanceTactico(partidoId).subscribe({
      next: (response) => {
        this.balanceTactico.set(response.balance);
      },
      error: (err) => console.error(err)
    });
  }

  //Titular Esquema Tactico
  cargarTitulares(partidoId: string) {
    this.partido.obtenerTitulares(partidoId).subscribe({
      next: (response) => {
        const titulares = response.titulares;
        
        const combinados = this.posicionesCampo.map((pos, index) => ({
          ...pos,
          jugador: titulares[index] || null
        }));
        
        this.playersEnCampo.set(combinados);
      },
      error: (err) => console.error(err)
    });
  }
 
  //Nombre Jugadores
  getNombreCorto(nombreCompleto: string): string {
  const partes = nombreCompleto.split(' ');
  if (partes.length === 1) return partes[0];
  
  return `${partes[0]} ${partes[1][0]}.`;
}



}
