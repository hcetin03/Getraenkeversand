import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Wine } from 'lucide-angular';
import { Header } from '../header/header';

@Component({
  selector: 'app-jubilaeum',
  standalone: true,
  imports: [],
  templateUrl: './jubilaeum.html',
  styleUrl: './jubilaeum.css'
})
export class Jubilaeum {
  // Daten für das Jubiläumsprodukt
  anniversaryProduct = {
    name: 'Classic Gold Edition',
    description: 'Feinste Zutaten, traditionell gebraut und edel gereift – unser exklusives Jubiläumsgetränk.',
    price: '4.99',
    imageUrl: 'assets/images/jubilee-bottle.png', // Pfad zu deinem Bild
    isStockLow: true // Schaltet die Warnung im HTML an/aus
  };

  // Methode für den Button-Klick
  onOrder(product: any) {
    console.log(`${product.name} wurde in den Warenkorb gelegt!`);
    // Hier kommt deine Bestell-Logik hin
  }
}