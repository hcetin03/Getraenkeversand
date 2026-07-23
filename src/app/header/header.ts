import { Component, inject, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  private http = inject(HttpClient);
  private cartService = inject(CartService);

  suchergebnisse: any[] = [];
  sucheOffen = false;
  private sucheSubject = new Subject<string>();
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);

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

      this.sucheSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(begriff =>
            this.http.get<any[]>(`http://localhost:3000/api/produkt/suche?q=${begriff}`)
          )
        )
        .subscribe({
          next: (ergebnisse) => {
            this.suchergebnisse = ergebnisse;
            this.sucheOffen = ergebnisse.length > 0;
            // erzwingt sofortiges Neuzeichnen
            this.cdr.detectChanges();   
          },
          error: (err) => console.error('Fehler bei der Suche:', err)
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

  onSucheInput(event: any): void {
    const begriff = event.target.value;

    if (!begriff || begriff.trim().length < 2) {
      this.suchergebnisse = [];
      this.sucheOffen = false;
      return;
    }

    this.sucheSubject.next(begriff);
  }

  produktAuswaehlen(produkt: any): void {
    this.cartService.addToCart(produkt);
    this.suchergebnisse = [];
    this.sucheOffen = false;
  }

  sucheSchliessen(): void {
    setTimeout(() => (this.sucheOffen = false), 200);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const geklicktesElement = event.target as HTMLElement;
    const klickWarInnerhalbDerSuche = this.elementRef.nativeElement.contains(geklicktesElement);

    if (!klickWarInnerhalbDerSuche) {
      this.sucheOffen = false;
      this.cdr.detectChanges();
    }
  }

  aufEnterDrueckenSuche(event: any): void {
    const begriff = event.target.value;

    if (!begriff || begriff.trim() === '') {
      return;
    }

    this.sucheOffen = false;
    this.router.navigate(['/suche'], { queryParams: { q: begriff } });
  }
}