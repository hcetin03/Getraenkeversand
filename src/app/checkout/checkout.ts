import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout {

  private cartService = inject(CartService);
  private http = inject(HttpClient);
  private router = inject(Router);

  kunde = JSON.parse(localStorage.getItem('kunde') || '{}');

  gespeicherteAdresseNutzen = signal(true);

  lieferDaten = {
    vorname: this.kunde.vorname || '',
    nachname: this.kunde.nachname || '',
    adresse: this.kunde.adresse || '',
    plz: this.kunde.plz || '',
    wohnort: this.kunde.wohnort || '',
    telefon: this.kunde.telefon || ''
  };

  produkte = this.cartService.cartItems;

  versandkosten = signal(4.50);

  gutscheinRabatt = signal<number>(0);
  gutscheinCode = signal<string>('');

  gewaehlteZahlung = signal<string>('');

  zwischensumme = computed(() => {
    return this.produkte().reduce((sum, item) => sum + item.preis * item.menge, 0);
  });

  pfandsumme = computed(() => {
    return this.produkte().reduce((sum, item) => sum + item.pfand * item.menge, 0);
  });

  gesamtsumme = computed(() => {
    const summe = this.zwischensumme() + this.pfandsumme() + this.versandkosten() - this.gutscheinRabatt();
    return summe > 0 ? summe : 0;
  });

  constructor() {
    const vorgemerkterCode = localStorage.getItem('aktiverGutscheinCode');
    const vorgemerkterBetrag = localStorage.getItem('aktiverGutscheinBetrag');
    const vorgemerkterMindestwert = localStorage.getItem('aktiverGutscheinMindestwert');

    if (vorgemerkterCode && vorgemerkterBetrag) {
      const mindestwert = Number(vorgemerkterMindestwert || 0);

      if (this.zwischensumme() >= mindestwert) {
        this.gutscheinCode.set(vorgemerkterCode);
        this.gutscheinRabatt.set(Number(vorgemerkterBetrag));
      }
    }
  }

  adresseUmschalten() {
    this.gespeicherteAdresseNutzen.set(!this.gespeicherteAdresseNutzen());

    if (this.gespeicherteAdresseNutzen()) {
      this.lieferDaten = {
        vorname: this.kunde.vorname || '',
        nachname: this.kunde.nachname || '',
        adresse: this.kunde.adresse || '',
        plz: this.kunde.plz || '',
        wohnort: this.kunde.wohnort || '',
        telefon: this.kunde.telefon || ''
      };
    } else {
      this.lieferDaten = {
        vorname: '',
        nachname: '',
        adresse: '',
        plz: '',
        wohnort: '',
        telefon: ''
      };
    }
  }

  verbindlichBestellen() {
    const kundeId = localStorage.getItem('kundeId');

    if (!kundeId) {
      alert('Bitte melde dich zuerst an.');
      return;
    }

    if (this.produkte().length === 0) {
      alert('Dein Warenkorb ist leer.');
      return;
    }

    if (!this.gewaehlteZahlung()) {
      alert('Bitte wähle eine Zahlungsmethode aus.');
      return;
    }

    if (
      !this.lieferDaten.vorname ||
      !this.lieferDaten.nachname ||
      !this.lieferDaten.adresse ||
      !this.lieferDaten.plz ||
      !this.lieferDaten.wohnort ||
      !this.lieferDaten.telefon
    ) {
      alert('Bitte fülle alle Felder der Lieferadresse aus.');
      return;
    }

    const bestellteProdukte = this.produkte().map(item => ({
      getraenk: {
        id: item.id,
        preis: item.preis,
        pfand: item.pfand
      },
      menge: item.menge
    }));

    const bestellDaten = {
      bestellteProdukte: bestellteProdukte,
      gesamtpreis: this.gesamtsumme(),
      datum: new Date().toISOString().slice(0, 10),
      kundenId: Number(kundeId),
      lieferadresse: this.lieferDaten,
      zahlungsmethode: this.gewaehlteZahlung()
    };

    this.http.post('http://localhost:3000/api/bestellung', bestellDaten)
      .subscribe({
        next: (response: any) => {

          // Falls ein Gutschein aktiv war: jetzt einlösen
          if (this.gutscheinCode()) {
            this.http.post('http://localhost:3000/api/gutschein/einloesen', {
              code: this.gutscheinCode(),
              kundenId: Number(kundeId),
              bestellungId: response.bestellung_id
            }).subscribe({
              next: () => {
                localStorage.removeItem('aktiverGutscheinCode');
                localStorage.removeItem('aktiverGutscheinBetrag');
                localStorage.removeItem('aktiverGutscheinMindestwert');
              },
              error: (err) => console.error('Fehler beim Einlösen des Gutscheins:', err)
            });
          }

          this.cartService.cartItems.set([]);

          this.router.navigate(['/bestellbestaetigung'], {
            state: {
              bestellungId: response.bestellung_id,
              rechnungsNummer: response.rechnungs_nummer,
              kunde: this.kunde
            }
          });
        },
        error: (error) => {
          console.error(error);
          alert(error.error?.message || 'Bestellung fehlgeschlagen.');
        }
      });
  }
}