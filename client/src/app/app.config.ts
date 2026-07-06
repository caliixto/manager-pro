import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Necesario para componentes animados
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; // Este es el tema por defecto moderno

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(), // Obligatorio para que los componentes funcionen bien
    providePrimeNG({
      theme: {
        preset: Aura, // Aquí aplicas el estilo base de v21
        options: {
          darkModeSelector: 'system' // O 'none' si quieres forzar solo claro u oscuro
        }
      }
    })
  ]
};
