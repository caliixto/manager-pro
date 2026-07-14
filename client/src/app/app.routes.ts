import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard/dashboard/dashboard';
import { ResetPassword } from './features/reset-password/reset-password';
import { Plantilla } from './features/plantilla/plantilla/plantilla';
import { AppLayout } from './shared/app-layout/app-layout';
import { Calendario } from './features/calendario/calendario/calendario';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'reset-password/:token', component: ResetPassword },
    {path: '',component: AppLayout,
      children: [
	  { path: 'login', component: Login },
	  { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard },
    { path: 'plantilla', component: Plantilla },
//  { path: 'tacticas', component: Tacticas },       // 
    { path: 'calendario', component: Calendario },
//  { path: 'estadisticas', component: Estadisticas }, // 
    ]
  }
];