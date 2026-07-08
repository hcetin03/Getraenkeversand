import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-angebote',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Header
  ],
  templateUrl: './angebote.html',
  styleUrl: './angebote.css'
})
export class Angebote {
  
  // Die strukturierte Produktliste für deine Kategorien
  kategorisierteProdukte = [
    {
      name: 'Wasser',
      produkte: [
        { 
          id: 1, 
          name: 'Gerolsteiner Naturell 6er Pack', 
          alterPreis: '6.99', 
          neuerPreis: '5.59', 
          rabatt: 20, 
          imageUrl: '/images/GerolsteinerNaturell6.avif',
          kategorie: '6 x 1,5L (PET) | zzgl. Pfand'
          
        }
      ]
    },
    {
      name: 'Limo & Saft',
      produkte: [
        { 
          id: 2, 
          name: 'Coca-Cola', 
          alterPreis: '1.99', 
          neuerPreis: '1.79', 
          rabatt: 10, 
          imageUrl: '/images/cocacola.webp',
          kategorie: '1 x 1,5L (PET) | zzgl. Pfand'
        }
      ]
    }
    
  ];

  // Methode für den „Mehr anzeigen“-Button der jeweiligen Kategorie
  loadMore(kategorieName: string): void {
    console.log('Mehr anzeigen geklickt für Kategorie:', kategorieName);
    // Hier kannst du später eine Routing-Logik oder Pagination einbauen
  }

  // Methode für den großen Warenkorb-Button
  inDenWarenkorb(produkt: any): void {
    console.log(`${produkt.name} wurde zum Angebotspreis von ${produkt.neuerPreis} € hinzugefügt!`);
    // Hier kommt später dein Service-Aufruf rein (z.B. this.cartService.add(produkt))
  }
}
