import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) { }
  //TEMPORÄR: wird später noch durch echten backend ersetzt 
  login (email: string, password: string): Observable<any> {
    const mockResponse = {
      token: 'test-token-123',
      rolle: email.includes('mitarbeiter') ? 'mitarbeiter' : 'kunde'
    };
    return of(mockResponse).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rolle', res.rolle);
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    return of({ success: true });
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