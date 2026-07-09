import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    this.errorMsg = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: response.mensaje,
          confirmButtonColor: '#22c55e',
          background: '#272C30',
          color: '#ffffff',
          iconColor: '#22c55e',
        }).then(() => {
          this.router.navigate(['/']); // vuelve a la landing
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'El enlace no es válido o ha caducado';
      }
    });
  }
}