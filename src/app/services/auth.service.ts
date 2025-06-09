import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userSubject.next({ token, role: localStorage.getItem('role') });
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.userSubject.next({ token: response.token, role: response.role });
      })
    );
  }

  registerCandidate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidate/register`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.userSubject.next({ token: response.token, role: response.role });
      })
    );
  }

  registerRecruiter(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recruiter/register`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.userSubject.next({ token: response.token, role: response.role });
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.userSubject.next(null);
    this.router.navigate(['']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}