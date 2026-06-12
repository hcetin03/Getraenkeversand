import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Wichtig für [(ngModel)]
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html', // <-- ".component" entfernt
  styleUrls: ['./login.css']   // <-- ".component" entfernt
})
export class Login { // <-- Geändert von LoginComponent zu Login (passend zu deinen app.routes.ts)
  // Objekt zur Speicherung der Formulardaten
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  // Zustand für die Passwort-Sichtbarkeit
  showPassword = false;

  // Schaltet die Passwort-Sichtbarkeit um
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Wird aufgerufen, wenn das Formular abgeschickt wird
  onLogin() {
    console.log('Login-Daten abgesendet:', this.loginData);
  }
}