import { Injectable, signal, computed } from '@angular/core';
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

  constructor(){
    this.warenkorbLaden();
  }

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

    this.warenkorbSpeichern();
  }

  // Nutzer ändert Menge manuell - Menge wird aktualisiert
  public mengeAendern(getraenk : Getraenk, neueMenge : number){
    const vorhanden = this.produkte().find(produkt => getraenk.id === produkt.getraenk.id);
    if(vorhanden){
      vorhanden.menge = neueMenge;
      this.produkte.set([...this.produkte()]);
    }

    this.warenkorbSpeichern();
  }

  public produktEntfernen(id : number){
    this.produkte.set(this.produkte().filter(produkt => produkt.getraenk.id !== id))

    this.warenkorbSpeichern();
  }

  // computed berechnet die Zwischensumme automatisch neu, sobald ein Produkt sich ändert - Beobachtung des signals produkte
  // computed ist eine Funktion
  public zwischensumme = computed(() => 
    // reduce geht jeden einzelnen Wert des Arrays produkte durch - 1. Parameter ist das laufende Ergebnis, 2. Parameter ist das zu iterierende Element aus dem Array
    this.produkte().reduce((summe, produkt) => summe + produkt.getraenk.preis * produkt.menge, 0)
  )

  public lieferkosten = computed(() =>
    this.zwischensumme() > 0 ? 2.90 : 0
  )

  public gesamtsumme = computed(() =>
    this.zwischensumme() + this.lieferkosten()
  )

  private warenkorbSpeichern (){
    localStorage.setItem("warenkorb", JSON.stringify(this.produkte()))
  }

  private warenkorbLaden (){
    const daten = localStorage.getItem("warenkorb")
    if(daten){
      this.produkte.set(JSON.parse(daten))
    }
  }

  public warenkorbLeeren (){
      // leert Array im Signal
      this.produkte.set([]);
      // löscht gespeicherten Warenkorb aus dem Browser
      localStorage.removeItem('warenkorb');
    }
  
}
