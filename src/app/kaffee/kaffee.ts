import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kaffee',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, HttpClientModule],
  templateUrl: './kaffee.html',
  styleUrl: './kaffee.css',
})

export class Kaffee {
    produkte: any[] = [];

  constructor(private http: HttpClient) {
this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Kaffee')
      .subscribe(data => {
        this.produkte = data;
        console.log(this.produkte);
      });

  }
}