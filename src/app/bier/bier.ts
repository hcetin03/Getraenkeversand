import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';
import { Warenkorb } from '../services/warenkorb.service';
import { Getraenk } from '../model/getraenk.model';

@Component({
  selector: 'app-bier',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Header],
  templateUrl: './bier.html',
  styleUrl: './bier.css',
})
export class Bier {
  private warenkorbService = inject(Warenkorb);


  inDenWarenkorb(produkt: Getraenk) {
  this.warenkorbService.produktHinzufuegen(produkt);
  }
}
