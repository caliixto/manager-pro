import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-equipo',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './perfil-equipo.html',
  styleUrl: './perfil-equipo.css',
})
export class PerfilEquipo {
   nombreEquipo = '';
  previewUrl = signal<string | null>(null);
  archivoSeleccionado: File | null = null;
  guardando = signal(false);
  mensaje = signal('');

  constructor(private authService: AuthService,  private router: Router) {
    const user = this.authService.getUser();
    this.nombreEquipo = user?.nombreEquipo ?? '';
    this.previewUrl.set(user?.escudo ?? null);
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.archivoSeleccionado = input.files[0];
      // Vista previa instantánea antes de subir, leyendo el archivo local
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(this.archivoSeleccionado);
    }
  }

  guardar(): void {
    this.guardando.set(true);
    this.mensaje.set('');

    this.authService.actualizarPerfil(this.nombreEquipo, this.archivoSeleccionado).subscribe({
      next: (res) => {
        // Actualizamos el usuario guardado localmente con los datos nuevos
        const userActual = this.authService.getUser();
        if (userActual) {
          this.authService.saveUser({
            ...userActual,
            nombreEquipo: res.user.nombreEquipo,
            escudo: res.user.escudo,
          });
        }
        this.guardando.set(false);
        this.mensaje.set('¡Guardado correctamente!');

         setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1200);
      },
      error: (err) => {
        console.log(err);
        this.guardando.set(false);
        this.mensaje.set('Error al guardar los cambios');
      }
    });
  }
}
