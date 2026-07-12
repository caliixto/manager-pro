import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { PlayerRadar } from '../../player-radar/player-radar';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
     console.log('Dashboard cargado'); 
    const user = this.authService.getUser();
    console.log('Usuario:', user);
    if (user) {
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
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
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
}
