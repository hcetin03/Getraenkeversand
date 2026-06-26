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
    }, {
        id: 3,
        name: 'Alpro Barista Soya',
        beschreibung: 'Cremiger Sojadrink speziell für Kaffee, pflanzlich und gut aufschäumbar.',
        preis: 2.55,
        kategorie: 'Milch',
        menge: 1000,
        bildUrl: 'public/images/Alpro_Barista_Soya_1_Liter_1035685243.png',
        lagerbestand: 75
    }, {
        id: 4,
        name: 'Alpro Hafer & Mandel',
        beschreibung: 'Milder Pflanzendrink aus Hafer und Mandel, cremig im Geschmack und vielseitig verwendbar.',
        preis: 2.79,
        kategorie: 'Milch',
        menge: 1000,
        bildUrl: 'public/images/Alpro_HaferMandel.avif',
        lagerbestand: 25
    }, {
        id: 5,
        name: 'Alpro geröstete Mandel ohne Zucker',
        beschreibung: 'Pflanzlicher Mandeldrink ohne Zucker mit mild gerösteter Note - perfekt für Kaffee, Frühstück und Smoothies.',
        preis: 3.49,
        kategorie: 'Milch',
        bestand: 25,
        bildUrl: 'public/images/Alpro_Mandel.avif',
    }

    ];

getAllGetraenke(): Observable<Getraenk[]> {
    return of(this.getraenke);
}

getGetraenkeByKategorie(kategorie: string): Observable<Getraenk[]> {
    return of(this.getraenke.filter(g => g.kategorie === kategorie));
}*/