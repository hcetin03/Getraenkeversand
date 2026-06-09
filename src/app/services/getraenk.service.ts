/*import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Getraenk {
    id: number;
    name: string;
    beschreibung: string;
    preis: number;
    kategorie: string;
    menge: number;
    bildUrl: string;
    lagerbestand: number;
}

@Injectable({
    providedIn: 'root'
})

export class GetraenkService{
    private getraenke: Getraenk[] = [{
        id: 1,
        name: 'Alpro Barista Mandel',
        beschreibung: 'Cremiger Mandeldrink für Kaffee und Smoothies',
        preis: 2.49,
        kategorie: 'Milch',
        menge: 1000,
        bildUrl: 'public/images/Alpro-Barista-Mandel.png',
        lagerbestand: 100
    }, {
        id: 2,
        name: 'Alpro Barista Not Milk',
        beschreibung: 'Shhh... This is Not Mlk. Pflanzlich, aufschäumbar, aus Hafer',
        preis: 2.49,
        kategorie: 'Milch',
        menge: 1000,
        bildUrl: 'public/images/Alpro_Barista_Not_MLK.png',
        lagerbestand: 75
    }];

/*getAllGetraenke(): Observable<Getraenk[]> {
    return of(this.getraenke);
}

getGetraenkeByKategorie(kategorie: string): Observable<Getraenk[]> {
    return of(this.getraenke.filter(g => g.kategorie === kategorie));
}*/
