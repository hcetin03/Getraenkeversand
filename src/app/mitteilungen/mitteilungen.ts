import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Header } from '../header/header';

type Kundennachricht = {
  id: number;
  titel: string;
  nachricht: string;
  erstellt_am: string;
};

@Component({
  selector: 'app-mitteilungen',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Header
  ],
  templateUrl: './mitteilungen.html',
  styleUrl: './mitteilungen.css'
})
export class Mitteilungen implements OnInit {

  nachrichten: Kundennachricht[] = [];

  nachrichtenWerdenGeladen = false;

  nachrichtenFehler = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nachrichtenLaden();
  }

  nachrichtenLaden(): void {
    const gespeicherterKunde = JSON.parse(
      localStorage.getItem('kunde') || 'null'
    );

    const kundeId =
      localStorage.getItem('kundeId') ||
      gespeicherterKunde?.id?.toString();

    if (!kundeId) {
      this.router.navigate(['/login']);
      return;
    }

    this.nachrichtenWerdenGeladen = true;
    this.nachrichtenFehler = '';

    this.http.get<Kundennachricht[]>(
      `http://localhost:3000/api/kunden/${kundeId}/nachrichten`
    ).subscribe({
      next: (daten) => {
        this.nachrichten = daten;
        this.nachrichtenWerdenGeladen = false;
      },

      error: (fehler) => {
        console.error(
          'Fehler beim Laden der Mitteilungen:',
          fehler
        );

        this.nachrichtenFehler =
          'Die Mitteilungen konnten nicht geladen werden.';

        this.nachrichtenWerdenGeladen = false;
      }
    });
  }
}