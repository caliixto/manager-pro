import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  onSubmit() {
    console.log('Login:', this.email, this.password);
    // De momento sin backend real, aquí luego llamarás a tu AuthService
  }
}