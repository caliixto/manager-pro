import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  @Output() forgotPassword = new EventEmitter<void>();

  onSubmit() {
    this.errorMsg = '';
    this.cargando = true;

    this.authService.loginUsers(this.email, this.password).subscribe({
      next: (response: any) => {
        this.completarLogin(response);
      },
      error: () => {
        this.authService.loginAdmin(this.email, this.password).subscribe({
          next: (response: any) => {
            this.completarLogin(response);
          },
          error: () => {
            this.cargando = false;
            this.errorMsg = 'Correo o contraseña incorrectos';
          }
        });
      }
    });
  }

  private completarLogin(response: any) {
    this.authService.saveToken(response.token);
    this.authService.saveUser(response.user);
    this.cargando = false;

    if (response.user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}