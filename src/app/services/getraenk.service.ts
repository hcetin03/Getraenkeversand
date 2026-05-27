import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { Getraenk} from '../model/getraenk.model';

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
        bildUrl: 'public/images/alpro-barista-mandel.jpg',
        lagerbestand: 100
    }];

getAllGetraenke(): Observable<Getraenk[]> {
    return of(this.getraenke);
}

getGetraenkeByKategorie(kategorie: string): Observable<Getraenk[]> {
    return of(this.getraenke.filter(g => g.kategorie === kategorie));
}
}