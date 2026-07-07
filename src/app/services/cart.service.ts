import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<any[]>([]);

  addToCart(produkt: any) {
    console.log('--- VOLLSTÄNDIGES OBJEKT AUS DB ---', produkt);

    const aktuelleItems = this.cartItems();
    const produktId = produkt.Produkt_ID || produkt.id || produkt.Id;
    const produktName = produkt.Name || produkt.name;

    const existiertBereits = aktuelleItems.find(item => item.id === produktId);

    if (existiertBereits) {
      const aktualisiert = aktuelleItems.map(item => 
        item.id === produktId ? { ...item, menge: item.menge + 1 } : item
      );
      this.cartItems.set(aktualisiert);
    } else {
      // Bildpfad ermitteln
      let bildName = produkt.Bild || produkt.bild || 'standard.png';
      if (typeof bildName === 'string' && bildName.startsWith('assets/images/')) {
        bildName = bildName.replace('assets/images/', '');
      }

      // ======================================================
      // AUTOMATISCHE PREIS-SUCHE (INTELLIGENT)
      // ======================================================
      let gefundenerPreis = 0;

      // Wir prüfen zuerst die gängigsten Namen
      if (produkt.Preis !== undefined) gefundenerPreis = Number(produkt.Preis);
      else if (produkt.preis !== undefined) gefundenerPreis = Number(produkt.preis);
      
      // Falls immer noch 0, durchsuchen wir alle Spalten nach einer Zahl (außer ID und Pfand)
      if (gefundenerPreis === 0) {
        for (const key in produkt) {
          if (Object.prototype.hasOwnProperty.call(produkt, key)) {
            const value = produkt[key];
            // Wenn der Wert eine Zahl/Dezimalzahl ist und die Spalte nicht ID oder Pfand heißt
            if (!isNaN(value) && value !== null && !key.toLowerCase().includes('id') && !key.toLowerCase().includes('pfand')) {
              gefundenerPreis = Number(value);
              console.log(`-> Automatisch Preis in Spalte "${key}" gefunden:`, gefundenerPreis);
              break;
            }
          }
        }
      }

      // Absicherung: Wenn absolut keine Zahl gefunden wurde, setzen wir einen Testpreis von 12.99
      if (gefundenerPreis === 0) {
        gefundenerPreis = 12.99;
        console.log('-> Kein Preis-Feld im Objekt gefunden. Testpreis 12.99 gesetzt.');
      }

      const neuesItem = {
        id: produktId,
        name: produktName,
        typ: produkt.hauptkategorie || 'Kaffee',
        preis: gefundenerPreis,
        menge: 1,
        bild: bildName
      };
      
      this.cartItems.set([...aktuelleItems, neuesItem]);
    }
    
    alert(`${produktName} wurde zum Warenkorb hinzugefügt!`);
  }
}