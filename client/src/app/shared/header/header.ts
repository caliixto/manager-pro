import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../notificaciones';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuAbierto = false; 
  notificacionesAbierto = false;

  private notificacionService = inject(NotificacionService);
  reclamando = signal(false);
  notificaciones = this.notificacionService.notificaciones;

  constructor(private auth: AuthService, private router: Router) {}
  name:any = "";

  ngOnInit(){
    const user = this.auth.getUser();
    this.name = user?.name;
    this.cargarNotificaciones();
  }

   cargarNotificaciones() {
    this.notificacionService.obtenerNotificaciones().subscribe({
      next: (res) => this.notificaciones.set(res.notificaciones),
      error: (err) => console.error('Error al cargar notificaciones', err)
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleNotificaciones() {
    this.notificacionesAbierto = !this.notificacionesAbierto;
    this.menuAbierto = false;
  }


  reclamarTodas() {
    if (this.notificaciones().length === 0 || this.reclamando()) return;

    this.reclamando.set(true);

    this.notificacionService.reclamarTodas().subscribe({
      next: (res) => {
        const userActual = this.auth.getUser();
        if (userActual) {
          this.auth.saveUser({ ...userActual, monedas: res.monedasActuales });
        }
        this.notificaciones.set([]);
        this.reclamando.set(false);
      },
      error: (err) => {
        console.error('Error al reclamar notificaciones', err);
        this.reclamando.set(false);
      }
    });
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  get currentUser() {
    return this.auth.getUser();
  }


  get monedasFormateadas(): string {
    const monedas = this.auth.usuario()?.monedas ?? 0;
    return (monedas / 1000000).toFixed(1) + 'M';
  }

}
