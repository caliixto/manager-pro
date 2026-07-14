import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth';

export interface Jugador {
  _id?: string;
  nombre: string;
  foto: string;
  posicion: 'POR' | 'DEF' | 'CEN' | 'DEL';
  edad: number;
  dorsal?: number;
  estadoFisico: number;
  stats: {
    velocidad: number;
    pase: number;
    tiro: number;
    resistencia: number;
  };
}

interface JugadoresResponse {
  status: string;
  total: number;
  jugadores: Jugador[];
}

interface JugadorResponse {
  status: string;
  mensaje: string;
  jugador: Jugador;
}

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private apiUrl = 'http://localhost:5000/api/players';

  constructor(private http: HttpClient, private auth: AuthService) {
    console.log('Instancia de Plantilla creada');
  }

  private getHeaders(): HttpHeaders {
  const token = this.auth.getToken();
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  });
}

  listarJugadores(): Observable<JugadoresResponse> {
    return this.http.get<JugadoresResponse>(`${this.apiUrl}/jugadores`, { headers: this.getHeaders() });
  }

  crearJugador(jugador: Partial<Jugador>): Observable<JugadorResponse> {
    return this.http.post<JugadorResponse>(this.apiUrl, jugador, { headers: this.getHeaders() });
  }

  listar(): Observable<JugadoresResponse> {
    return this.http.get<JugadoresResponse>(`${this.apiUrl}/listar`, { headers: this.getHeaders() });
  }

  obtenerJugador(id: string): Observable<JugadorResponse> {
    return this.http.get<JugadorResponse>(`${this.apiUrl}/jugadores/${id}`, { headers: this.getHeaders() });
  }

  editarJugador(id: string, jugador: Partial<Jugador>): Observable<JugadorResponse> {
    return this.http.put<JugadorResponse>(`${this.apiUrl}/jugadores/${id}`, jugador, { headers: this.getHeaders() });
  }

  eliminarJugador(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jugadores/${id}`, { headers: this.getHeaders() });
  }
}