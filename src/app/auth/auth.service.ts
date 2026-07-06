import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  //TEMPORÄR: wird später noch durch echten backend ersetzt
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rolle', res.rolle);
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rolle');
    this.router.navigate(['/login']);
  }

  istEingeloggt(): boolean {
    return !!localStorage.getItem('token');
  }

  getRolle(): string | null {
    return localStorage.getItem('rolle');
  }
}
