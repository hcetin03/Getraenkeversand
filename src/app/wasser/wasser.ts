import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-wasser',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './wasser.html',
  styleUrl: './wasser.css',
})
export class Wasser implements OnInit {
  produkte: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Wasser-Seite wurde geöffnet');

    this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Wasser')
      .subscribe({
        next: (data) => {
          this.produkte = data;
          this.cdr.detectChanges();
          console.log('Wasser Produkte:', this.produkte);
        },
        error: (error) => {
          console.error('Fehler beim Laden:', error);
        }
      });
  }
}