import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-angebote',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
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
          name: 'Extaler Mineralquell Classic', 
          alterPreis: '6.49', 
          neuerPreis: '5.99', 
          rabatt: 7, 
          imageUrl: 'assets/wasser.jpg',
          kategorie: '12 x 0,7L (Glas) | zzgl. Pfand'
        }
      ]
    },
    {
      name: 'Limo & Saft',
      produkte: [
        { 
          id: 2, 
          name: 'Pepsi Zero Zucker', 
          alterPreis: '15.99', 
          neuerPreis: '12.99', 
          rabatt: 18, 
          imageUrl: 'assets/pepsi.jpg',
          kategorie: '12 x 1L (PET) | zzgl. Pfand'
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
