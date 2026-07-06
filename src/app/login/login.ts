import { Component, inject } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { RouterLink, RouterLinkActive } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive], 
  templateUrl: './login.html', 
  styleUrls: ['./login.css']   
})
export class Login { 
  // Objekt zur Speicherung der Formulardaten
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoginMode = true; // <-- NEU: true bedeutet Login, false bedeutet Registrierung

  // HttpClient injizieren für die Server-Anfragen
  private http = inject(HttpClient);

  // Schaltet die Passwort-Sichtbarkeit um
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // NEU: Schaltet zwischen Login und Registrierung um
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // Wird aufgerufen, wenn das Formular abgeschickt wird
  onSubmit() { // <-- Umbenannt von onLogin zu onSubmit
    
    if (this.isLoginMode) {
      // ======================================================
      // 1. LOGIN MODUS
      // ======================================================
      console.log('Login-Daten werden an Server gesendet:', this.loginData);

      this.http.post('http://localhost:3000/api/login', this.loginData)
        .subscribe({
          next: (response: any) => {
            console.log('Server-Antwort:', response);
            alert('Erfolgreich eingeloggt!');
            // Hier könntest du den Nutzer später weiterleiten (z.B. zum Dashboard/Shop)
          },
          error: (error) => {
            console.error('Fehler beim Login:', error);
            // Nutzt die Fehlermeldung vom Express-Server, falls vorhanden
            alert(error.error?.message || 'Login fehlgeschlagen. Bitte überprüfe deine Daten.');
          }
        });

    } else {
      // ======================================================
      // 2. REGISTRIERUNGS MODUS
      // ======================================================
      console.log('Registrierungs-Daten werden an Server gesendet:', this.loginData);

      this.http.post('http://localhost:3000/api/register', this.loginData)
        .subscribe({
          next: (response: any) => {
            console.log('Server-Antwort:', response);
            alert('Registrierung erfolgreich! Du kannst dich jetzt einloggen.');
            this.isLoginMode = true; // Schaltet nach Erfolg automatisch zur Anmeldung um
          },
          error: (error) => {
            console.error('Fehler bei der Registrierung:', error);
            alert(error.error?.message || 'Registrierung fehlgeschlagen.');
          }
        });
    }

  }
}