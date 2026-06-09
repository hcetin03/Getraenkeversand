import {Getraenk} from './getraenk.model';

export interface Bestellposition{
    getraenk: Getraenk;
    anzahl: number;
}

export interface Bestellung {
    id: number;
    kundenId: number;
    datum: Date;
    positionen: Bestellposition[];
    gesamtpreis: number;
    status: string;  //'In Bearbeitung'
}