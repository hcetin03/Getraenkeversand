import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './warenkorb.html',
  styleUrl: './warenkorb.css'
})
export class WarenkorbComponent {

  constructor(private location: Location) {}

  public items = signal<any[]>([
    { name: 'Gerolsteiner Medium', typ: 'wasser', preis: 1.19, menge: 1, bildUrl: 'assets/gerolsteiner.png' },
    { name: 'Chardonnay Trocken', typ: 'wein', preis: 5.99, menge: 2, bildUrl: 'assets/wein1.png' }
  ]);

  zwischensumme = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.preis * item.menge), 0);
  });

  lieferkosten = computed(() => {
    return this.zwischensumme() > 0 ? 2.90 : 0;
  });

  gesamtsumme = computed(() => {
    return this.zwischensumme() + this.lieferkosten();
  });

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

  goBack() {
    this.location.back();
  }
}