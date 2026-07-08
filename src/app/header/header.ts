import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  kunde: any = null;

  constructor(private router: Router) {
    this.kundeLaden();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.kundeLaden();
      });
  }

  kundeLaden() {
    this.kunde = JSON.parse(localStorage.getItem('kunde') || 'null');
  }

  istEingeloggt(): boolean {
    return this.kunde !== null;
  }

  logout() {
    localStorage.removeItem('kunde');
    localStorage.removeItem('kundeId');

    this.kunde = null;

    alert('Du wurdest erfolgreich ausgeloggt.');

    this.router.navigate(['/home']);
  }

  
}