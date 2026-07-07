import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { CartService } from '../services/cart.service'; // WICHTIG: Der neue CartService!

@Component({
  selector: 'app-kaffee',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './kaffee.html',
  styleUrl: './kaffee.css',
})
export class Kaffee implements OnInit {
  produkte: any[] = [];
  
  // HIER KORRIGIERT: Wir injizieren jetzt den richtigen CartService mit den Signals
  private cartService = inject(CartService); 

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Kaffee-Seite wurde geöffnet');

    // Holt die Kaffee-Produkte live aus eurer MySQL-Datenbank
    this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Kaffee')
      .subscribe({
        next: (data) => {
          this.produkte = data;
          this.cdr.detectChanges();
          console.log('Kaffee Produkte aus DB geladen:', this.produkte);
        },
        error: (error) => {
          console.error('Fehler beim Laden der Produkte:', error);
        }
      });
  }

  // HIER KORRIGIERT: Diese Funktion wird aufgerufen, wenn du auf das blaue Plus drückst
  inDenWarenkorb(produkt: any) {
    console.log('Klick auf + ausgelöst für:', produkt);
    
    // Ruft die richtige Methode im neuen CartService auf!
    this.cartService.addToCart(produkt);
  }
}