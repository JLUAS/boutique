import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://boutique-t9xx.onrender.com';

  constructor(private http: HttpClient, private router: Router) { }

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/user`, user);
  }

  registerAdmin(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/admin`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  adminLogin(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin`, user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  navLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }

  addDatabase(username: string, baseDeDatos: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/add/database`, { username, baseDeDatos });
  }

  getUserDatabases(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/databases/${username}`);
  }
}
