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

  gesamtsumme = computed(() => {
    if (this.items().length === 0) return 0;
    return this.zwischensumme() + this.pfandsumme() + this.lieferkosten();
  });

  ngOnInit() {
    console.log('Warenkorb geöffnet:', this.items());
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