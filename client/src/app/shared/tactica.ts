import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../features/auth/auth';
import { environment } from '../../environments/environment';
import { Jugador } from '../features/plantilla/jugador';

interface AlineacionResponse {
  status: string;
  mensaje?: string;
  alineacion: Jugador[];
}

@Injectable({
  providedIn: 'root'
})
export class TacticaService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
  }

  obtenerAlineacion(): Observable<AlineacionResponse> {
    return this.http.get<AlineacionResponse>(`${this.apiUrl}/alineacion`, { headers: this.getHeaders() });
  }

  guardarAlineacion(idsJugadores: string[]): Observable<AlineacionResponse> {
    return this.http.put<AlineacionResponse>(`${this.apiUrl}/alineacion`, { alineacion: idsJugadores }, { headers: this.getHeaders() });
  }
}
