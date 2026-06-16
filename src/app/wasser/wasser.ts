import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wasser',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, HttpClientModule],
  templateUrl: './wasser.html',
  styleUrl: './wasser.css',
})

export class Wasser {
    produkte: any[] = [];

  constructor(private http: HttpClient) {

    this.http.get<any[]>('http://localhost:3000/api/produkte')
      .subscribe(data => {
        this.produkte = data;
        console.log(this.produkte);
      });

  }
}