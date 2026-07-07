import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service'; // WICHTIG: Pfad zum CartService

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warenkorb.html',
  styleUrls: ['./warenkorb.css']
})
export class WarenkorbComponent implements OnInit {
  private http = inject(HttpClient);
  private cartService = inject(CartService); // Service aktivieren

  // Hier verknüpfen wir uns direkt mit dem Live-Signal aus dem Service!
  items = this.cartService.cartItems; 

  // Berechnet die Zwischensumme automatisch anhand der tatsächlichen Artikel
  zwischensumme = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.preis * item.menge), 0);
  });

  // Feste Lieferkosten
  lieferkosten = signal<number>(4.50);

  // Berechnet die Gesamtsumme automatisch
  gesamtsumme = computed(() => {
    if (this.items().length === 0) return 0;
    return this.zwischensumme() + this.lieferkosten();
  });

  ngOnInit() {
    console.log('Warenkorb geöffnet. Aktuelle Artikel im Service-Signal:', this.items());
  }

  // ======================================================
  // BESTELLUNG ABSCHICKEN
  // ======================================================
  onCheckout() {
    if (this.items().length === 0) {
      alert('Dein Warenkorb ist leer!');
      return;
    }

    const kundeId = localStorage.getItem('kundeId');
    if (!kundeId) {
      alert('Bitte melde dich zuerst an, bevor du eine Bestellung aufgeben kannst.');
      return;
    }

    const gemappteProdukte = this.items().map(item => ({
      getraenk: {
        id: item.id,
        preis: item.preis
      },
      menge: item.menge
    }));

    const bestellDaten = {
      bestellteProdukte: gemappteProdukte,
      gesamtpreis: this.gesamtsumme(),
      datum: new Date().toISOString().slice(0, 10),
      kundenId: Number(kundeId)
    };

    this.http.post('http://localhost:3000/api/bestellung', bestellDaten)
      .subscribe({
        next: (response: any) => {
          alert('Vielen Dank für deine Bestellung!\n\nBestellnummer: #' + response.bestellung_id);
          
          // Öffnet die schicke, neue PDF-Rechnung aus dem Backend
          window.open(`http://localhost:3000/api/rechnung/pdf/${response.bestellung_id}`, '_blank');

          // Warenkorb im Service leeren
          this.cartService.cartItems.set([]);
        },
        error: (error) => {
          console.error(error);
          alert(error.error?.message || 'Die Bestellung konnte nicht abgeschlossen werden.');
        }
      });
  }

  // ======================================================
  // WARENKORB-STEUERUNG
  // ======================================================

  onRemove(name: string) {
    const gefilterteItems = this.items().filter(item => item.name !== name);
    this.cartService.cartItems.set(gefilterteItems);
  }

  onQuantityChange(name: string, event: any) {
    const neueMenge = parseInt(event.target.value, 10);
    if (isNaN(neueMenge) || neueMenge < 1) return;

    const aktualisierteItems = this.items().map(item => {
      if (item.name === name) {
        return { ...item, menge: neueMenge };
      }
      return item;
    });

    this.cartService.cartItems.set(aktualisierteItems);
  }

  goBack() { 
    window.history.back(); 
  }
}