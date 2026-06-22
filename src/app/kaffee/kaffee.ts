import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-kaffee',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './kaffee.html',
  styleUrl: './kaffee.css',
})
export class Kaffee implements OnInit {
  produkte: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Kaffee-Seite wurde geöffnet');

    this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Kaffee')
      .subscribe({
        next: (data) => {
          this.produkte = data;
          this.cdr.detectChanges();
          console.log('Kaffee Produkte:', this.produkte);
        },
        error: (error) => {
          console.error('Fehler beim Laden:', error);
        }
      });
  }
}