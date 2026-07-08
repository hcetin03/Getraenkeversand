import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-jubilaeum',
  standalone: true,
  // CommonModule hinzugefügt, damit @if und Property-Bindings ([src]) im HTML funktionieren
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './jubilaeum.html',
  styleUrl: './jubilaeum.css'
})
export class Jubilaeum {
  // Daten für das Jubiläumsprodukt
  anniversaryProduct = {
    name: 'Classic Gold Edition',
    description: 'Feinste Zutaten, traditionell gebraut und edel gereift – unser exklusives Jubiläumsgetränk.',
    price: '4.99',
    
    /* WICHTIGER HINWEIS ZUM PFAD:
       image: 
    */
    imageUrl: '/images/Rasgon.avif', 
    
    isStockLow: true // Schaltet die Warnung im HTML an/aus
  };

  // Methode für den Button-Klick
  onOrder(product: any) {
    console.log(`${product.name} wurde in den Warenkorb gelegt!`);
    // Hier kommt deine Bestell-Logik hin
  }
}