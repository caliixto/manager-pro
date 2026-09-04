import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  liga = 'laliga-1';
  errorMsg = '';

  constructor(private authService: AuthService) {}

  @Output() onRegisterSuccess = new EventEmitter<void>();

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    this.errorMsg = '';

    this.authService.registerUsers(this.name, this.email, this.password, this.liga).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.authService.showSuccessAlert('¡Registro exitoso!', 'Ya puedes iniciar sesión con tus credenciales.');
        this.onRegisterSuccess.emit();
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.errorMsg = err.error?.message ?? 'Error al registrar, inténtalo de nuevo';
      }
    });
  }
}