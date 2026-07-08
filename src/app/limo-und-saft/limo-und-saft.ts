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
  
  // Steuert, welcher Button im HTML als aktiv markiert ist
  aktiveKategorie: string = 'alle';

  private cartService = inject(CartService);

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Hier nutzen wir jetzt exakt die Schreibweise mit den Bindestrichen aus deiner DB!
    const dbKategorieName = 'Limo-und-Saft'; 

    this.http.get<any[]>(`http://localhost:3000/api/produkt?kategorie=${dbKategorieName}`)
      .subscribe({
        next: (data) => {
          console.log('Erfolgreich geladene Limo-Produkte:', data);
          
          this.alleProdukte = data;
          this.produkte = data; // Am Anfang zeigen wir alle an
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Fehler beim Laden der Produkte vom Server:', error);
        }
      });
  }

  // Diese Methode steuert die Filter-Buttons im HTML (Cola, Limonade, Eistee, Energy)
  setKategorie(kategorie: string) {
    this.aktiveKategorie = kategorie;
    
    if (kategorie === 'alle') {
      this.produkte = this.alleProdukte;
    } else {
      // Filtert die Produkte passend nach der Spalte 'unterkategorie' aus deiner DB
      this.produkte = this.alleProdukte.filter(item => {
        const suchBegriff = kategorie.toLowerCase();
        
        return (
          item.unterkategorie?.toLowerCase() === suchBegriff ||
          item.typ?.toLowerCase() === suchBegriff
        );
      });
    }
    this.cdr.detectChanges();
  }

  inDenWarenkorb(produkt: any) {
    this.cartService.addToCart(produkt);
  }
}