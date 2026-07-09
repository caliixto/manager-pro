import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard/dashboard/dashboard';
import { ResetPassword } from './features/reset-password/reset-password';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard},
  { path: 'reset-password/:token', component: ResetPassword }
  //  el squad

  //  el tactics

  //  el stats
];