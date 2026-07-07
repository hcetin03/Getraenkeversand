import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-limo-und-saft',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './limo-und-saft.html',
  styleUrl: './limo-und-saft.css',
})
export class LimoUndSaft implements OnInit {
  // Hier speichern wir alle Produkte aus der DB ab
  alleProdukte: any[] = [];
  // Hier landen die gefilterten Produkte, die im HTML angezeigt werden
  produkte: any[] = [];
  
  // Diese Variablen hat dein HTML vermisst:
  aktiveKategorie: string = 'alle';

  private cartService = inject(CartService);

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Limo')
      .subscribe({
        next: (data) => {
          this.alleProdukte = data;
          this.produkte = data; // Am Anfang zeigen wir alle an
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Fehler beim Laden von Limo:', error)
      });
  }

  // Diese Methode steuert eure Filter-Buttons im HTML
  setKategorie(kategorie: string) {
    this.aktiveKategorie = kategorie;
    
    if (kategorie === 'alle') {
      this.produkte = this.alleProdukte;
    } else {
      // Filtert die Produkte nach Unterkategorie (z. B. 'cola', 'limonade', 'eistee', 'energy')
      // Hinweis: Falls eure DB-Spalte anders heißt (z.B. unterkategorie), passe "item.typ" an
      this.produkte = this.alleProdukte.filter(item => 
        item.typ?.toLowerCase() === kategorie.toLowerCase() || 
        item.unterkategorie?.toLowerCase() === kategorie.toLowerCase()
      );
    }
    this.cdr.detectChanges();
  }

  inDenWarenkorb(produkt: any) {
    this.cartService.addToCart(produkt);
  }
}