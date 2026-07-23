import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../header/header';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-suche',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './suche.html',
  styleUrl: './suche.css'
})
export class Suche implements OnInit {
  suchbegriff = '';
  ergebnisse: any[] = [];
  ladeVorgang = true;

  private cartService = inject(CartService);

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.suchbegriff = params['q'] || '';

      if (this.suchbegriff) {
        this.sucheAusfuehren();
      }
    });
  }

  sucheAusfuehren(): void {
    this.ladeVorgang = true;

    this.http.get<any[]>(`http://localhost:3000/api/produkt/suche?q=${this.suchbegriff}&limit=100`)
      .subscribe({
        next: (ergebnisse) => {
          this.ergebnisse = ergebnisse;
          this.ladeVorgang = false;
          this.cdr.detectChanges();
          console.log('Suchergebnisse geladen:', this.ergebnisse);
        },
        error: (err) => {
          console.error('Fehler bei der Suche:', err);
          this.ladeVorgang = false;
          this.cdr.detectChanges();
        }
      });
  }

  inDenWarenkorb(produkt: any): void {
    this.cartService.addToCart(produkt);
  }
}