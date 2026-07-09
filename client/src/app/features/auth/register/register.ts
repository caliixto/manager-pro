import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [FormsModule,NgIf],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMsg = '';

  constructor(private authService:AuthService){}

  @Output() onRegisterSuccess = new EventEmitter<void>();


  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }
   this.authService.registerUsers(this.name, this.email, this.password).subscribe({
      next: (response:any) => {
       this.authService.saveToken(response.token);
       this.authService.showSuccessAlert('¡Registro exitoso!','Ya puedes iniciar sesión con tus credenciales.');
       this.onRegisterSuccess.emit();
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMsg = 'Correo o contraseñas incorrectas';
      }
    });
  }
}