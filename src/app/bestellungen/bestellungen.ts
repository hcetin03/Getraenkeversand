import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';

type Kundenbestellung = {
  id: number;
  datum: string;
  artikel: string;
  menge: number;
  gesamtpreis: number;
  status: string;
  rechnungs_nummer: string | null;
};

@Component({
  selector: 'app-bestellungen',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Header
  ],
  templateUrl: './bestellungen.html',
  styleUrl: './bestellungen.css'
})
export class Bestellungen implements OnInit {

  bestellungen: Kundenbestellung[] = [];

  wirdGeladen = true;

  fehler = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bestellungenLaden();
  }

  bestellungenLaden(): void {
    const kunde = JSON.parse(
      localStorage.getItem('kunde') || 'null'
    );

    const gespeicherteKundeId =
      localStorage.getItem('kundeId');

    const kundeId =
      gespeicherteKundeId || kunde?.id;

    if (!kundeId) {
      this.wirdGeladen = false;
      this.fehler =
        'Bitte melde dich an, um deine Bestellungen zu sehen.';
      return;
    }

    this.http.get<Kundenbestellung[]>(
      `http://localhost:3000/api/kunden/${kundeId}/bestellungen`
    ).subscribe({
      next: (daten) => {
        this.bestellungen = daten;
        this.wirdGeladen = false;
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Laden der Bestellungen:',
          fehler
        );

        this.fehler =
          fehler.error?.message ||
          'Die Bestellungen konnten nicht geladen werden.';

        this.wirdGeladen = false;
      }
    });
  }

  rechnungOeffnen(bestellungId: number): void {
    window.open(
      `http://localhost:3000/api/rechnung/pdf/${bestellungId}`,
      '_blank'
    );
  }

  statusKlasse(status: string): string {
    switch (status) {
      case 'In Bearbeitung':
        return 'status-bearbeitung';

      case 'Versendet':
        return 'status-versendet';

      case 'Zugestellt':
        return 'status-zugestellt';

      default:
        return 'status-eingegangen';
    }
  }

  zumLogin(): void {
    this.router.navigate(['/login']);
  }
}