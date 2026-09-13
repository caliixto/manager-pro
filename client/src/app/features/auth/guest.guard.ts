import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const user = authService.getUser();
    if (user?.role === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false; // bloquea el acceso a Landing/Login, ya redirigido
  }

  return true; // no tiene sesión, puede ver Landing/Login normalmente
};