import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth';
import { environment } from '../../../environments/environment';

export interface Partido {
  _id?: string;
  rival: string;
  fecha: string;
  lugar: 'casa' | 'fuera';
  formacionRival: string;
  jugado: boolean;
  resultado: {
    golesPropios: number | null;
    golesRival: number | null;
  };
}

interface PartidosResponse {
  status: string;
  total: number;
  partidos: Partido[];
}

interface ProximoPartidoResponse {
  status: string;
  partido: Partido | null;
}

interface ResultadosResponse {
  status: string;
  resultados: Partido[];
}

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  private apiUrl = `${environment.apiUrl}/partidos`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
  }

  listarPartidos(): Observable<PartidosResponse> {
    return this.http.get<PartidosResponse>(this.apiUrl, { headers: this.getHeaders() });
  }

  obtenerProximoPartido(): Observable<ProximoPartidoResponse> {
    return this.http.get<ProximoPartidoResponse>(`${this.apiUrl}/proximo`, { headers: this.getHeaders() });
  }

  obtenerUltimosResultados(limite: number = 5): Observable<ResultadosResponse> {
    return this.http.get<ResultadosResponse>(`${this.apiUrl}/resultados?limite=${limite}`, { headers: this.getHeaders() });
  }

  editarPartido(id: string, cambios: Partial<Partido>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cambios, { headers: this.getHeaders() });
  }
}