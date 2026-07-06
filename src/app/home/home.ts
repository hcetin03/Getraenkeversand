import { Component, ElementRef, ViewChild, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms'; // NEU: Wichtig für Inputs
import { LucideAngularModule, Wine } from 'lucide-angular';
import { Header } from '../header/header';
import { SuchService } from '../such'; // Pfad zu deiner neuen such.ts
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  // NEU: FormsModule hier in die Imports packen!
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, Header, FormsModule, RouterModule], 
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Service injecten
  private suchService = inject(SuchService);

  readonly LogoFlasche = Wine;
  logoPath = 'images/homelogo.PNG';

  WasserIcon = 'droplet';
  LimoIcon = 'cup-soda';
  BierIcon = 'beer';
  MilchIcon = 'glass-water';
  WeinIcon = 'wine';
  KaffeeIcon = 'coffee';

  // NEU: Deine Produktliste (Beispiel-Daten)
  alleProdukte = signal([
    { name: 'Coca Cola Original', kategorie: 'Limo & Saft', preis: '1.99', bild: 'assets/cola.png' },
    { name: 'Cola Zero', kategorie: 'Limo & Saft', preis: '1.99', bild: 'assets/colazero.png' },
    { name: 'Mezzo Mix', kategorie: 'Limo & Saft', preis: '1.99', bild: 'assets/mezzo.png' },
    { name: 'Gerolsteiner Sprudel', kategorie: 'Wasser', preis: '0.89', bild: 'assets/wasser.png' },
    { name: 'Paulaner Spezi', kategorie: 'Limo & Saft', preis: '1.29', bild: 'assets/spezi.png' }
  ]);

  // NEU: Diese Liste filtert sich vollautomatisch, sobald im Header getippt wird!
  gefilterteProdukte = computed(() => {
    const begriff = this.suchService.suchBegriff().toLowerCase().trim();
    
    if (!begriff) {
      return this.alleProdukte();
    }
    
    return this.alleProdukte().filter(p => p.name.toLowerCase().includes(begriff));
  });

  @ViewChild('brandSlider') brandSlider!: ElementRef;

  scrollSlider(distance: number) {
    if (this.brandSlider) {
      this.brandSlider.nativeElement.scrollLeft += distance;
    }
  }
}