import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  status: string;
  mensaje: string;
  token?: string;
}

interface ForgotPasswordResponse {
  status: string;
  mensaje: string;
}

interface ResetPasswordResponse {
  status: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root' 
})
export class AuthService {

  //URL
   private apiUrl = `${environment.apiUrl}/api`;
   private tokenKey = 'auth_token';

  constructor (private http:HttpClient){}

  loginAdmin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, {email, password });
  }

  loginUsers(email: string, password: string): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, {email, password});
  }

  registerUsers(nombrecompleto:string,email: string, password: string): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/register`, {nombrecompleto,email, password});
  }

  
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveUser(user: { name: string; role: string }): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  getUser(): { name: string; role: string } | null {
    const data = localStorage.getItem('auth_user');
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem(this.welcomeShownKey);
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/users/forgotpassword`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${this.apiUrl}/auth/resetpassword`, { token, newPassword });
  }

  private welcomeShownKey = 'welcome_shown';

  markWelcomeAsShown(): void {
    sessionStorage.setItem(this.welcomeShownKey, 'true');
  }

  wasWelcomeShown(): boolean {
      return sessionStorage.getItem(this.welcomeShownKey) === 'true';
  }



  //Alerta

  showSuccessAlert(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#22c55e',
      background: '#272C30',
      color: '#ffffff',
      iconColor: '#22c55e',
      timer: 3000
    });
  }
}