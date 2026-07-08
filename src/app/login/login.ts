import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  loginData = {
    vorname: '',
    nachname: '',
    email: '',
    adresse: '',
    plz: '',
    wohnort: '',
    telefon: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoginMode = true;

  private http = inject(HttpClient);
  private router = inject(Router);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      const loginPayload = {
        email: this.loginData.email,
        password: this.loginData.password,
        rememberMe: this.loginData.rememberMe
      };

      this.http.post('http://localhost:3000/api/login', loginPayload)
        .subscribe({
          next: (response: any) => {
            console.log('Server-Antwort:', response);

            localStorage.setItem('kundeId', response.user.id);
            localStorage.setItem('kunde', JSON.stringify(response.user));

            alert('Erfolgreich eingeloggt!');

            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Fehler beim Login:', error);
            alert(error.error?.message || 'Login fehlgeschlagen. Bitte überprüfe deine Daten.');
          }
        });

    } else {
      const registerPayload = {
        vorname: this.loginData.vorname,
        nachname: this.loginData.nachname,
        email: this.loginData.email,
        adresse: this.loginData.adresse,
        plz: this.loginData.plz,
        wohnort: this.loginData.wohnort,
        telefon: this.loginData.telefon,
        password: this.loginData.password
      };

      this.http.post('http://localhost:3000/api/register', registerPayload)
        .subscribe({
          next: (response: any) => {
            console.log('Server-Antwort:', response);
            alert('Registrierung erfolgreich! Du kannst dich jetzt einloggen.');

            this.isLoginMode = true;

            this.loginData = {
              vorname: '',
              nachname: '',
              email: '',
              adresse: '',
              plz: '',
              wohnort: '',
              telefon: '',
              password: '',
              rememberMe: false
            };
          },
          error: (error) => {
            console.error('Fehler bei der Registrierung:', error);
            alert(error.error?.message || 'Registrierung fehlgeschlagen.');
          }
        });
    }
  }
}