import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div style="padding: 40px; color: white;">
      <h1>Panel de Administración</h1>
      <p>Próximamente: gestión de usuarios, baneos, estadísticas del sistema.</p>
    </div>
  `,
})
export class Admin {}
