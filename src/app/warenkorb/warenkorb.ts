import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Warenkorb } from '../services/warenkorb.service';
import { Getraenk } from '../model/getraenk.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './warenkorb.html',
  styleUrl: './warenkorb.css'
})
export class WarenkorbComponent {
  private warenkorbService = inject(Warenkorb);
  public items = this.warenkorbService.produkteAnzeigen
  zwischensumme = this.warenkorbService.zwischensumme;
  lieferkosten = this.warenkorbService.lieferkosten;
  gesamtsumme = this.warenkorbService.gesamtsumme;
  // zeigt ob Bestellung gerade gesendet wird
  laedt = false;
  bestellungErfolgreich = false;
  bestellungFehler = false;
  // um Anfragen an die API zu schicken
  private http = inject(HttpClient);
  

  constructor(private location: Location) {}

  onQuantityChange(getraenk : Getraenk, event: any) {
    const neueMenge = parseInt(event.target.value, 10);
    if (!isNaN(neueMenge) && neueMenge > 0) {
        this.warenkorbService.mengeAendern(getraenk, neueMenge);
    }
  }

  onRemove(id : number) {
    this.warenkorbService.produktEntfernen(id);
  }

  goBack() {
    this.location.back();
  }

  bestellen(){
    if(this.items().length==0){
      return;
    }
    this.laedt = true;

    const bestellung = {
      bestellteProdukte : this.warenkorbService.produkteAnzeigen(),
      gesamtpreis : this.warenkorbService.gesamtsumme(),
      datum : new Date()
    }
    // TODO: API_URL ERGÄNZEN
    this.http.post('http://localhost:3000/api/bestellung', bestellung).subscribe({
      next: () => {
        this.bestellungErfolgreich = true;
        this.laedt = false;
        this.warenkorbService
        this.warenkorbService.warenkorbLeeren();
      },
      error: () => {
        this.bestellungFehler = true;
        this.laedt = false;
      }
    });


  }
}