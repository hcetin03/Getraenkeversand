import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Getraenk } from '../model/getraenk.model';

export interface WarenkorbItem {
    getraenk: Getraenk;
    menge: number;
}

@Injectable({
  providedIn: 'root',
})

export class Warenkorb {
  // signal speichert Artikel, Änderungen werden automatisch an Angular weitergegeben
  private produkte = signal<WarenkorbItem[]>([]);
  public produkteAnzeigen = this.produkte.asReadonly();

  public produktHinzufuegen(getraenk : Getraenk){
    // mit === wird Wert und Typ verglichen -> genauer!
    // vorhanden zeigt das gefundene Produkt im Warenkorb an bzw. speichert es in der Variable vorhanden
    const vorhanden = this.produkte().find(produkt => getraenk.id === produkt.getraenk.id);

    if(vorhanden){
      vorhanden.menge++;
      // this.produkte() holt das aktuelle Array aus dem Signal
      // [] erstellt eine Kopie vom Array
      // .set gibt dem Signal Bescheid, dass neuer Inhalt vorhanden ist
      this.produkte.set([...this.produkte()]);
    }
    else {
      this.produkte.set([...this.produkte(), {getraenk: getraenk, menge: 1}]);
    }
  }

  public mengeAendern(getraenk : Getraenk){
    
  }
}
