import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';
import { Warenkorb } from '../services/warenkorb.service';
import { Getraenk } from '../model';

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
  private warenkorbService = inject(Warenkorb);

  setKategorie(kategorie: string) {
    this.aktiveKategorie = kategorie;
  }

  inDenWarenkorb(produkt : Getraenk){
      this.warenkorbService.produktHinzufuegen(produkt);
  }

}