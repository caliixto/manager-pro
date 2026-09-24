import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../features/auth/auth';
import { environment } from '../../environments/environment';

export interface Notificacion {
  _id: string;
  tipo: string;
  mensaje: string;
  monto: number;
  fecha: string;
}

interface NotificacionesResponse {
  status: string;
  notificaciones: Notificacion[];
}

interface ReclamarResponse {
  status: string;
  mensaje: string;
  totalReclamado: number;
  monedasActuales: number;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private apiUrl = `${environment.apiUrl}/notificaciones`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  obtenerNotificaciones(): Observable<NotificacionesResponse> {
    return this.http.get<NotificacionesResponse>(this.apiUrl, { headers: this.getHeaders() });
  }

  reclamarTodas(): Observable<ReclamarResponse> {
    return this.http.post<ReclamarResponse>(`${this.apiUrl}/reclamar-todas`, {}, { headers: this.getHeaders() });
  }
}