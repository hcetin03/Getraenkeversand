import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

type Bestellung = {
  id: number;
  kunde: string;
  datum: string;
  artikel: string;
  menge: number;
  gesamtpreis: number;
  status: string;
};

type Getraenk = {
  id: number;
  name: string;
  kategorie: string;
  hauptkategorie?: string;
  lagerbestand: number;
  bestand?: number;
};

type Kunde = {
  id: number;
  vorname: string;
  nachname: string;
  email: string;
  anzahlBestellungen: number;
  stammkunde: boolean;
};

type Mitarbeiter = {
  id: number;
  vorname: string;
  nachname: string;
  email: string;
  rolle: string;
  aktiv: boolean;
  erstellt_am?: string;
};

@Component({
  selector: 'app-mitarbeiter',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './mitarbeiter.html',
  styleUrl: './mitarbeiter.css'
})
export class MitarbeiterComponent implements OnInit {

  passwort = '';
  istEingeloggt = false;
  loginFehler = '';

  bestellungen: Bestellung[] = [];

  getraenke: Getraenk[] = [];

  kunden: Kunde[] = [];

  mitarbeiterListe: Mitarbeiter[] = [];

  mitarbeiterForm = {
    id: null as number | null,
    vorname: '',
    nachname: '',
    email: '',
    passwort: '',
    rolle: 'Mitarbeiter',
    aktiv: true
  };

  mitarbeiterMeldung = '';
  mitarbeiterFehler = '';
  mitarbeiterWirdGespeichert = false;

  // Lieferstatus
  statusOptionen: string[] = [
    'Eingegangen',
    'In Bearbeitung',
    'Versendet',
    'Zugestellt'
  ];

  statusWirdGespeichertId: number | null = null;

  // Lagerbestand
  kategorien = [
    'Wasser',
    'Wein',
    'Limo & Saft',
    'Kaffee',
    'Milch',
    'Bier'
  ];

  ausgewaehlteKategorie = 'Wasser';

  ausgewaehltesGetraenk: Getraenk | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Bestellung[]>(
      'http://localhost:3000/api/bestellungen'
    ).subscribe({
      next: (daten) => {
        this.bestellungen = daten;
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Laden der Bestellungen:',
          fehler
        );
      }
    });

    this.http.get<Kunde[]>(
      'http://localhost:3000/api/kunden'
    ).subscribe({
      next: (daten) => {
        this.kunden = daten;
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Laden der Kunden:',
          fehler
        );
      }
    });

    this.http.get<Getraenk[]>(
      'http://localhost:3000/api/produkt'
    ).subscribe({
      next: (daten) => {
        this.getraenke = daten.map(getraenk => ({
          ...getraenk,
          lagerbestand: getraenk.bestand ?? 0
        }));
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Laden der Produkte:',
          fehler
        );
      }
    });

    this.mitarbeiterLaden();
  }

  // =====================================================
  // MITARBEITER-LOGIN
  // =====================================================

  login(): void {
    if (this.passwort === 'geheim123') {
      this.istEingeloggt = true;
      this.loginFehler = '';
    } else {
      this.loginFehler =
        'Falsches Passwort. Bitte versuchen Sie es erneut.';
    }
  }

  // =====================================================
  // LAGERBESTAND
  // =====================================================

  bestandErhoehen(
    getraenk: Getraenk,
    menge: number
  ): void {
    if (menge > 0) {
      getraenk.lagerbestand += menge;
    }
  }

  bestandSpeichern(getraenk: Getraenk): void {
    if (getraenk.lagerbestand < 0) {
      getraenk.lagerbestand = 0;
    }

    this.http.put(
      'http://localhost:3000/api/produkt/' +
      getraenk.id +
      '/lagerbestand',
      {
        lagerbestand: getraenk.lagerbestand
      }
    ).subscribe({
      next: () => {
        alert(
          'Lagerbestand von ' +
          getraenk.name +
          ' wurde gespeichert.'
        );
      },

      error: (fehler) => {
        console.error(fehler);

        alert(
          'Fehler beim Speichern vom Lagerbestand.'
        );
      }
    });
  }

  get produkteDerKategorie(): Getraenk[] {
    return this.getraenke.filter(getraenk => {
      const kategorie = (
        getraenk.hauptkategorie ||
        getraenk.kategorie ||
        ''
      ).toLowerCase();

      const ausgewaehlt =
        this.ausgewaehlteKategorie.toLowerCase();

      if (ausgewaehlt === 'limo & saft') {
        return (
          kategorie.includes('limo') ||
          kategorie.includes('saft')
        );
      }

      return kategorie.includes(ausgewaehlt);
    });
  }

  kategorieWechseln(): void {
    this.ausgewaehltesGetraenk = null;
  }

  // =====================================================
  // RECHNUNG
  // =====================================================

  rechnungDrucken(bestellung: Bestellung): void {
    window.open(
      `http://localhost:3000/api/rechnung/pdf/${bestellung.id}`,
      '_blank'
    );
  }

  // =====================================================
  // LIEFERSTATUS SPEICHERN
  // =====================================================

  statusSpeichern(bestellung: Bestellung): void {
    this.statusWirdGespeichertId = bestellung.id;

    this.http.put<{
      message: string;
      status: string;
    }>(
      `http://localhost:3000/api/bestellungen/${bestellung.id}/status`,
      {
        status: bestellung.status
      }
    ).subscribe({
      next: (antwort) => {
        bestellung.status = antwort.status;

        this.statusWirdGespeichertId = null;

        alert(
          'Der Lieferstatus wurde erfolgreich auf "' +
          antwort.status +
          '" geändert.'
        );
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Speichern des Lieferstatus:',
          fehler
        );

        this.statusWirdGespeichertId = null;

        alert(
          fehler.error?.message ||
          'Der Lieferstatus konnte nicht gespeichert werden.'
        );
      }
    });
  }

  // =====================================================
  // MITARBEITERVERWALTUNG
  // =====================================================

  mitarbeiterLaden(): void {
    this.mitarbeiterFehler = '';

    this.http.get<Mitarbeiter[]>(
      'http://localhost:3000/api/mitarbeiter?zeit=' +
      Date.now()
    ).subscribe({
      next: (daten) => {
        this.mitarbeiterListe = [...daten];
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Laden der Mitarbeiter:',
          fehler
        );

        this.mitarbeiterFehler =
          fehler.error?.message ||
          'Die Mitarbeiter konnten nicht geladen werden.';
      }
    });
  }

  mitarbeiterSpeichern(): void {
    const vorname =
      this.mitarbeiterForm.vorname.trim();

    const nachname =
      this.mitarbeiterForm.nachname.trim();

    const email =
      this.mitarbeiterForm.email.trim();

    const passwort =
      this.mitarbeiterForm.passwort.trim();

    if (!vorname || !nachname || !email) {
      this.mitarbeiterFehler =
        'Bitte Vorname, Nachname und E-Mail eingeben.';

      this.mitarbeiterMeldung = '';

      return;
    }

    if (
      this.mitarbeiterForm.id === null &&
      !passwort
    ) {
      this.mitarbeiterFehler =
        'Bitte für den neuen Mitarbeiter ein Passwort eingeben.';

      this.mitarbeiterMeldung = '';

      return;
    }

    const daten = {
      vorname: vorname,
      nachname: nachname,
      email: email,
      passwort: passwort,
      rolle: this.mitarbeiterForm.rolle,
      aktiv: this.mitarbeiterForm.aktiv
    };

    this.mitarbeiterFehler = '';
    this.mitarbeiterMeldung = '';
    this.mitarbeiterWirdGespeichert = true;

    const anfrage =
      this.mitarbeiterForm.id === null
        ? this.http.post<{ message: string }>(
            'http://localhost:3000/api/mitarbeiter',
            daten
          )
        : this.http.put<{ message: string }>(
            'http://localhost:3000/api/mitarbeiter/' +
            this.mitarbeiterForm.id,
            daten
          );

    anfrage.subscribe({
      next: (antwort) => {
        this.mitarbeiterWirdGespeichert = false;

        this.mitarbeiterFormZuruecksetzen();

        this.mitarbeiterMeldung =
          antwort.message;

        this.mitarbeiterLaden();
      },

      error: (fehler) => {
        this.mitarbeiterWirdGespeichert = false;

        console.error(
          'Fehler beim Speichern des Mitarbeiters:',
          fehler
        );

        this.mitarbeiterFehler =
          fehler.error?.message ||
          'Der Mitarbeiter konnte nicht gespeichert werden.';
      }
    });
  }

  mitarbeiterBearbeiten(
    mitarbeiter: Mitarbeiter
  ): void {
    this.mitarbeiterForm = {
      id: mitarbeiter.id,
      vorname: mitarbeiter.vorname,
      nachname: mitarbeiter.nachname,
      email: mitarbeiter.email,
      passwort: '',
      rolle: mitarbeiter.rolle,
      aktiv: mitarbeiter.aktiv
    };

    this.mitarbeiterFehler = '';
    this.mitarbeiterMeldung = '';
  }

  mitarbeiterFormZuruecksetzen(): void {
    this.mitarbeiterForm = {
      id: null,
      vorname: '',
      nachname: '',
      email: '',
      passwort: '',
      rolle: 'Mitarbeiter',
      aktiv: true
    };

    this.mitarbeiterFehler = '';
  }

  mitarbeiterLoeschen(
    mitarbeiter: Mitarbeiter
  ): void {
    const wirklichLoeschen =
      window.confirm(
        'Soll der Mitarbeiter ' +
        mitarbeiter.vorname +
        ' ' +
        mitarbeiter.nachname +
        ' wirklich gelöscht werden?'
      );

    if (!wirklichLoeschen) {
      return;
    }

    this.mitarbeiterFehler = '';
    this.mitarbeiterMeldung = '';

    this.http.delete<{ message: string }>(
      'http://localhost:3000/api/mitarbeiter/' +
      mitarbeiter.id
    ).subscribe({
      next: (antwort) => {
        if (
          this.mitarbeiterForm.id ===
          mitarbeiter.id
        ) {
          this.mitarbeiterFormZuruecksetzen();
        }

        this.mitarbeiterMeldung =
          antwort.message;

        this.mitarbeiterLaden();
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Löschen des Mitarbeiters:',
          fehler
        );

        this.mitarbeiterFehler =
          fehler.error?.message ||
          'Der Mitarbeiter konnte nicht gelöscht werden.';
      }
    });
  }

  // =====================================================
  // STAMMKUNDEN UND NEWSLETTER
  // =====================================================

  get stammkunden(): Kunde[] {
    return this.kunden.filter(
      kunde => kunde.stammkunde
    );
  }

  newsletterSenden(): void {
    if (this.stammkunden.length === 0) {
      alert(
        'Es gibt momentan keine Stammkunden.'
      );

      return;
    }

    const newsletter = {
      titel:
        'Exklusives Angebot für unsere Stammkunden',

      nachricht:
        'Als Dank für Ihre Treue erhalten Sie bei Ihrer nächsten Bestellung 10 % Rabatt auf unser gesamtes Getränkesortiment. Die Aktion gilt bis zum 31.07.2026.'
    };

    this.http.post<{
      message: string;
      anzahlEmpfaenger: number;
    }>(
      'http://localhost:3000/api/newsletter/senden',
      newsletter
    ).subscribe({
      next: (antwort) => {
        alert(
          'Die Nachricht wurde an ' +
          antwort.anzahlEmpfaenger +
          ' Stammkunde(n) gesendet.'
        );
      },

      error: (fehler) => {
        console.error(fehler);

        alert(
          fehler.error?.message ||
          'Die Nachricht konnte nicht gesendet werden.'
        );
      }
    });
  }
}