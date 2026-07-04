import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email = '';
  password = '';
  passwordWiederholung = '';
  fehler = '';
  erfolg = '';

  constructor(private auth: AuthService, private router: Router) { }

  onRegister() {
    if (this.password !== this.passwordWiederholung) {
      this.fehler = 'Passwwörter stimmen nicht überein.';
      return;
    }
    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        this.erfolg = 'Konto erstellt! Du wirst weitergeleitet...';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: () => this.fehler = 'Registrierung fehlgeschlagen.'
    });
  }
}
