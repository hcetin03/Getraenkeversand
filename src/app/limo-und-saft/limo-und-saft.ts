import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-limo-und-saft',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Header
  ],
  templateUrl: './limo-und-saft.html',
  styleUrl: './limo-und-saft.css',
})
export class LimoUndSaft {

  aktiveKategorie = 'alle';

  setKategorie(kategorie: string) {
    this.aktiveKategorie = kategorie;
  }

}