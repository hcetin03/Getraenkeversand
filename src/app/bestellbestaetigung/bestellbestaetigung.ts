import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bestellbestaetigung',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bestellbestaetigung.html',
  styleUrls: ['./bestellbestaetigung.css']
})
export class Bestellbestaetigung {
  daten = history.state;

  kunde = this.daten.kunde || {};
  bestellungId = this.daten.bestellungId;
  rechnungsNummer = this.daten.rechnungsNummer;
}