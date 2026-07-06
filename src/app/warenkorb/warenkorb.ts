import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warenkorb.html',
  styleUrls: ['./warenkorb.css']
})
export class WarenkorbComponent {
  private http = inject(HttpClient);
  // private cartService = inject(CartService); // <-- Falls ihr einen CartService habt, hier aktivieren!

  // ======================================================
  // WARENKORB-DATEN (SIGNALS)
  // ======================================================
  
  // Hier landen deine Produkte. Zum Testen habe ich dir direkt ein Beispiel-Getränk reingepackt,
  // damit du sofort siehst, ob das Bild und die Berechnung klappen!
  items = signal<any[]>([
    {
      id: 1,                 // Wichtig für die Datenbank!
      name: 'Gerolsteiner',
      typ: 'wasser',
      preis: 1.99,
      menge: 3,
      bild: 'gerolsteiner.png' // Muss im Ordner src/assets/images/ liegen
    }
  ]); 

  // Berechnet die Zwischensumme automatisch, sobald sich die Menge oder die Items ändern
  zwischensumme = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.preis * item.menge), 0);
  });

  // Feste Lieferkosten (kannst du anpassen)
  lieferkosten = signal<number>(4.50);

  // Berechnet die Gesamtsumme automatisch
  gesamtsumme = computed(() => {
    if (this.items().length === 0) return 0;
    return this.zwischensumme() + this.lieferkosten();
  });


  // ======================================================
  // BESTELLUNG ABSCHICKEN (CHECKOUT)
  // ======================================================
  onCheckout() {
    if (this.items().length === 0) {
      alert('Dein Warenkorb ist leer!');
      return;
    }

    // Wandelt deine flachen Warenkorb-Items in das Format um, das deine server.js erwartet
    const gemappteProdukte = this.items().map(item => ({
      getraenk: {
        id: item.id,       // Die ID aus der DB-Tabelle 'produkt'
        preis: item.preis  // Der Einzelpreis
      },
      menge: item.menge    // Die ausgewählte Menge
    }));

    // Das fertige Datenpaket für das Backend schnüren
    const bestellDaten = {
      bestellteProdukte: gemappteProdukte,
      gesamtpreis: this.gesamtsumme(),
      datum: new Date().toISOString().slice(0, 10), // Heutiges Datum (YYYY-MM-DD)
      kundenId: localStorage.getItem('kundeId') ? Number(localStorage.getItem('kundeId')) : null 
      // ^ Falls du beim Login die ID im localStorage gespeichert hast, wird sie hier automatisch mitgeschickt!
    };

    console.log('Sende folgende Bestelldaten ans Backend:', bestellDaten);

    // POST-Anfrage an deine server.js senden
    this.http.post('http://localhost:3000/api/bestellung', bestellDaten)
      .subscribe({
        next: (response: any) => {
          console.log('Erfolg vom Server:', response);
          alert('Vielen Dank für deine Bestellung! Bestellnummer: #' + response.bestellung_id);
          
          // Nach erfolgreicher Bestellung den Warenkorb leeren
          this.items.set([]);
        },
        error: (error) => {
          console.error('Fehler beim Absenden der Bestellung:', error);
          alert('Bestellung fehlgeschlagen. Bitte prüfe das VS-Code-Terminal deines Backends.');
        }
      });
  }


  // ======================================================
  // WARENKORB-LOGIK (MÜLLEIMER & MENGENÄNDERUNG)
  // ======================================================

  // Löscht einen Artikel komplett aus dem Warenkorb (Mülleimer-Button)
  onRemove(name: string) {
    const aktuelleItems = this.items();
    const gefilterteItems = aktuelleItems.filter(item => item.name !== name);
    this.items.set(gefilterteItems);
  }

  // Ändert die Menge live, wenn du im Input-Feld eine andere Zahl eintippst
  onQuantityChange(name: string, event: any) {
    const neueMenge = parseInt(event.target.value, 10);
    
    // Falls der Nutzer eine 0 oder ein Minuszeichen eintippt, setzen wir es auf mindestens 1
    if (isNaN(neueMenge) || neueMenge < 1) return;

    const aktualisierteItems = this.items().map(item => {
      if (item.name === name) {
        return { ...item, menge: neueMenge };
      }
      return item;
    });

    this.items.set(aktualisierteItems);
  }

  // Zurück-Button
  goBack() { 
    window.history.back(); 
  }
}