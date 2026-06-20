import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  fehler = '';

  constructor(private auth: AuthService, private router: Router) { }

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.rolle === 'mitarbeiter') {
          this.router.navigate(['home']); //mitarbeiter -> home
        } else {
          this.router.navigate(['home']); //kunde -> home
        }
      },
      error: () => this.fehler = 'Email oder Passwort ist falsch.'
    });
  }
}