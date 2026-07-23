import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warenkorb.html',
  styleUrls: ['./warenkorb.css']
})
export class WarenkorbComponent implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);

  items = this.cartService.cartItems;

  zwischensumme = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.preis * item.menge), 0);
  });

  pfandsumme = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.pfand * item.menge), 0);
  });

  lieferkosten = signal<number>(4.50);

  gutscheinRabatt = signal<number>(0);
  gutscheinCode = signal<string>('');

  mindestbestellwertErreicht = computed(() => {
    const mindestwert = Number(localStorage.getItem('aktiverGutscheinMindestwert') || 0);
    return this.zwischensumme() >= mindestwert;
  });

  gesamtsumme = computed(() => {
    if (this.items().length === 0) return 0;
    const rabatt = this.mindestbestellwertErreicht() ? this.gutscheinRabatt() : 0;
    const summe = this.zwischensumme() + this.pfandsumme() + this.lieferkosten() - rabatt;
    return summe > 0 ? summe : 0;
  });

  ngOnInit() {
    console.log('Warenkorb geöffnet:', this.items());

    const vorgemerkterCode = localStorage.getItem('aktiverGutscheinCode');
    const vorgemerkterBetrag = localStorage.getItem('aktiverGutscheinBetrag');

    if (vorgemerkterCode && vorgemerkterBetrag) {
      this.gutscheinCode.set(vorgemerkterCode);
      this.gutscheinRabatt.set(Number(vorgemerkterBetrag));
    }
  }

  gutscheinEntfernen(): void {
    this.gutscheinRabatt.set(0);
    this.gutscheinCode.set('');
    localStorage.removeItem('aktiverGutscheinCode');
    localStorage.removeItem('aktiverGutscheinBetrag');
  }

  // ======================================================
  // WEITER ZUM CHECKOUT
  // ======================================================
  // Hier wird noch KEINE Bestellung gespeichert.
  // Es wird nur geprüft, ob der Kunde eingeloggt ist.
  // Danach wird zur Checkout-Seite weitergeleitet.

  onCheckout() {
    if (this.items().length === 0) {
      alert('Dein Warenkorb ist leer!');
      return;
    }

    const kundeId = localStorage.getItem('kundeId');

    if (!kundeId) {
      alert('Bitte melde dich zuerst an, bevor du bestellen kannst.');
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/checkout']);
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

  // falls Warenkorb leer ist

  aufEnterDrueckenSuche(event: any): void {
    const begriff = event.target.value;

    if (!begriff || begriff.trim() === '') {
      return;
    }

    this.router.navigate(['/suche'], { queryParams: { q: begriff } });
  }
}