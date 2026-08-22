import { Component, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { PartidoLive } from '../../../shared/partido-live';
import { Authmodal } from "../../auth/authmodal/authmodal";


@Component({
  selector: 'app-partido-en-vivo',
  imports: [CommonModule, Authmodal],
  templateUrl: './partido-en-vivo.html',
  styleUrl: './partido-en-vivo.css',
})
export class PartidoEnVivo implements OnDestroy {
   nombreEquipoPropio = 'Tu equipo';
   
  constructor(public live: PartidoLive, private router: Router, private auth: AuthService) {
    this.nombreEquipoPropio = this.auth.getUser()?.nombreEquipo ?? 'Tu equipo';
  }

  get zonaBalon(): string {
    const eventos = this.live.eventosMostrados();
    if (eventos.length === 0) return 'medio';
    const ultimo = eventos[eventos.length - 1];
    if (ultimo.equipo === 'rival') return 'ataque-rival';
    if (ultimo.tipo === 'gol' || ultimo.tipo === 'remate_fuera' || ultimo.tipo === 'parada') return 'ataque';
    return 'medio';
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    this.live.detener();
  }
}
