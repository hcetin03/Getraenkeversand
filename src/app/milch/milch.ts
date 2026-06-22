import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-milch',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './milch.html',
  styleUrl: './milch.css',
})
export class Milch implements OnInit {
  produkte: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Milch-Seite wurde geöffnet');

    this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Milch')
      .subscribe({
        next: (data) => {
          this.produkte = data;
          this.cdr.detectChanges();
          console.log('Milch Produkte:', this.produkte);
        },
        error: (error) => {
          console.error('Fehler beim Laden:', error);
        }
      });
  }
}