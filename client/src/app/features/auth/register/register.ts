import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }
    console.log('Registro:', this.name, this.email, this.password);
    // De momento sin backend real
  }
}