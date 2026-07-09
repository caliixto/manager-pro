import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class ForgotPassword {
  email = '';
  loading = false;

  @Output() backToLogin = new EventEmitter<void>();

  constructor(private Auth: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.Auth.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Revisa tu correo',
          text: response.mensaje,
          confirmButtonColor: '#22c55e',
          background: '#272C30',
          color: '#ffffff',
          iconColor: '#22c55e',
        }).then(() => {
          this.backToLogin.emit();
        });
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: 'Inténtalo de nuevo más tarde.',
          confirmButtonColor: '#22c55e',
          background: '#272C30',
          color: '#ffffff',
        });
      }
    });
  }
}