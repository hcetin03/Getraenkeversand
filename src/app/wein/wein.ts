import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Warenkorb } from '../services/warenkorb.service';

@Component({
  selector: 'app-wein',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './wein.html',
  styleUrl: './wein.css',
})
export class Wein implements OnInit {
  produkte: any[] = [];
  private warenkorbService = inject(Warenkorb);

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Wein-Seite wurde geöffnet');

    this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Wein')
      .subscribe({
        next: (data) => {
          this.produkte = data;
          this.cdr.detectChanges();
          console.log('Wein Produkte:', this.produkte);
        },
        error: (error) => {
          console.error('Fehler beim Laden:', error);
        }
      });
  }
}