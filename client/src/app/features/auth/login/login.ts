import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  nombrecompleto = '';
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService:AuthService, private router:Router){}

  @Output() forgotPassword = new EventEmitter<void>();

  onSubmit() {
    this.authService.loginAdmin(this.email, this.password).subscribe({
      next: (response:any) => {
       this.authService.saveToken(response.token);
       this.authService.saveUser(response.user);
      this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = 'Correo o contraseña Admin incorrectos';
      }
    });

    this.authService.loginUsers(this.email, this.password).subscribe({
      next: (response:any) => {
       this.authService.saveToken(response.token);
       this.authService.saveUser(response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = 'Correo o contraseña incorrectos';
      }
    });
    
  }
}