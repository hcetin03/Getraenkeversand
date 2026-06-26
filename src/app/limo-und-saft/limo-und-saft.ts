import { Component, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Warenkorb } from '../services/warenkorb.service';
import { Getraenk } from '../model/getraenk.model';

@Component({
  selector: 'app-limo-und-saft',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './limo-und-saft.html',
  styleUrl: './limo-und-saft.css',
})
export class LimoUndSaft implements OnInit {

  private warenkorbService = inject(Warenkorb);
  alleProdukte: any[] = [];
  produkte: any[] = [];

  aktiveKategorie: string = 'alle';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Limo-und-Saft-Seite wurde geöffnet');

    this.http
      .get<any[]>('http://localhost:3000/api/produkt?kategorie=Limo-und-Saft')
      .subscribe({
        next: (data) => {
          this.alleProdukte = data;
          this.produkte = data;

          this.cdr.detectChanges();

          console.log('Limo-und-Saft Produkte:', this.produkte);
        },
        error: (error) => {
          console.error('Fehler beim Laden:', error);
        }
      });
  }

  inDenWarenkorb(produkt : Getraenk){
      this.warenkorbService.produktHinzufuegen(produkt);
  }

  setKategorie(kategorie: string): void {
    this.aktiveKategorie = kategorie;

    if (kategorie === 'alle') {
      this.produkte = this.alleProdukte;
    } else {
      this.produkte = this.alleProdukte.filter((produkt) =>
        produkt.unterkategorie?.toLowerCase() === kategorie.toLowerCase()
      );
    }
  }
}