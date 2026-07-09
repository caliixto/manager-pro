import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [],
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
}
