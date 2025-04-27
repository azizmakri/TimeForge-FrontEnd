import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {environment} from "./environments/environment";
import {Router} from "@angular/router";
import {UserStateService} from './user/user-state-service.service';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;

  };
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/timeforge/auth`;  // Base URL for your API (adjust accordingly)
  private currentUserSubject = new BehaviorSubject<any>(null);


  constructor(private http: HttpClient,
              private router: Router,
              private userStateService: UserStateService
    ) {}
  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('jwtToken');
    return of(!!token); // Returns true if a token exists, false otherwise
  }


  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  storeToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.storeUser(response.user);
        this.currentUserSubject.next(response.user);
        this.router.navigate(['/dashboard']);
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }




  logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
    this.userStateService.updateUser(null);
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }



  loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  private storeUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  resetPasswordbyId(userId: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/${userId}/reset-password`,
      {},
      { responseType: 'text' }
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }


  resetPassword(token: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      `http://localhost:8100/timeforge/auth/reset-password`,
      { token, password: newPassword },
      { headers, withCredentials: true }
    );
  }

}
