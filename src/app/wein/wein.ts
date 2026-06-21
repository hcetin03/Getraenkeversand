import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-wein',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, HttpClientModule, Header],
  templateUrl: './wein.html',
  styleUrl: './wein.css',
})

export class Wein {
    produkte: any[] = [];

  constructor(private http: HttpClient) {
this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Wein')
      .subscribe(data => {
        this.produkte = data;
        console.log(this.produkte);
      });

  }
}