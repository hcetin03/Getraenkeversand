import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './warenkorb.html', // <-- Korrigiert auf deinen echten Dateinamen!
  styleUrl: './warenkorb.css'      // <-- Korrigiert auf deinen echten Dateinamen!
})
export class WarenkorbComponent {

  // 1. Hier simulieren wir ein paar Test-Getränke für die Ansicht.
  // Wenn du das Array leer machst ( signal([]) ), siehst du den REWE-Leer-Zustand!
  public items = signal<any[]>([
    { name: 'Gerolsteiner Medium', typ: 'wasser', preis: 1.19, menge: 1, bildUrl: 'assets/gerolsteiner.png' },
    { name: 'Chardonnay Trocken', typ: 'wein', preis: 5.99, menge: 2, bildUrl: 'assets/wein1.png' }
  ]);

  // 2. Diese Berechnungen verlangt dein HTML-Code
  zwischensumme = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.preis * item.menge), 0);
  });

  lieferkosten = computed(() => {
    return this.zwischensumme() > 0 ? 2.90 : 0;
  });

  gesamtsumme = computed(() => {
    return this.zwischensumme() + this.lieferkosten();
  });

  // 3. Diese Funktionen fangen die Button-Klicks ab
  onQuantityChange(name: string, event: any) {
    const neueMenge = parseInt(event.target.value, 10);
    if (!isNaN(neueMenge) && neueMenge > 0) {
      this.items.set(
        this.items().map(item => item.name === name ? { ...item, menge: neueMenge } : item)
      );
    }
  }

  onRemove(name: string) {
    this.items.set(this.items().filter(item => item.name !== name));
  }
}