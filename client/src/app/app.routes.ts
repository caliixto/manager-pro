import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard/dashboard/dashboard';
import { ResetPassword } from './features/reset-password/reset-password';
import { Plantilla } from './features/plantilla/plantilla/plantilla';
import { AppLayout } from './shared/app-layout/app-layout';
import { Calendario } from './features/calendario/calendario/calendario';
import { ConvocatoriaDetalle } from './features/calendario/convocatoria-detalle/convocatoria-detalle';
import { Tacticas } from './features/tacticas/tacticas';
import { PartidoEnVivo } from './features/partido-en-vivo/partido-en-vivo/partido-en-vivo';
import { authGuard } from './features/auth/auth.guard';
import { Admin } from './features/admin/admin';
import { PerfilEquipo } from './features/perfil-equipo/perfil-equipo/perfil-equipo';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'reset-password/:token', component: ResetPassword },
    {path: '',component: AppLayout,
      children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'admin', component: Admin, canActivate: [authGuard] },
      { path: 'dashboard', component: Dashboard, canActivate: [authGuard]  },
      { path: 'plantilla', component: Plantilla, canActivate: [authGuard]  },
      { path: 'tacticas', component: Tacticas, canActivate: [authGuard]  },
      { path: 'convocatoria/:id', component: ConvocatoriaDetalle, canActivate: [authGuard]  },
      { path: 'jugador/:id',loadComponent: () => import('./features/jugador/ficha-jugador').then(m => m.FichaJugadorComponent), canActivate: [authGuard] },    
      { path: 'calendario', component: Calendario, canActivate: [authGuard]  },
      {path: 'clasificacion',loadComponent: () => import('./features/clasificacion/clasificacion/clasificacion').then(m => m.Clasificacion), canActivate: [authGuard] },
      { path: 'partido-en-vivo', component: PartidoEnVivo, canActivate: [authGuard]  },
      { path: 'perfil-equipo', component: PerfilEquipo, canActivate: [authGuard] },

    ]
  },
];