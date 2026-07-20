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

  accountMenueOffen = false;

  constructor(private router: Router) {
    this.kundeLaden();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.kundeLaden();
        this.accountMenueOffen = false;
      });
  }

  kundeLaden(): void {
    this.kunde = JSON.parse(
      localStorage.getItem('kunde') || 'null'
    );
  }

  istEingeloggt(): boolean {
    return this.kunde !== null;
  }

  accountMenueUmschalten(): void {
    this.accountMenueOffen =
      !this.accountMenueOffen;
  }

  accountMenueSchliessen(): void {
    this.accountMenueOffen = false;
  }

  logout(): void {
    localStorage.removeItem('kunde');
    localStorage.removeItem('kundeId');

    this.kunde = null;
    this.accountMenueOffen = false;

    alert('Du wurdest erfolgreich ausgeloggt.');

    this.router.navigate(['/home']);
  }
}