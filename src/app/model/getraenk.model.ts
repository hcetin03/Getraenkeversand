export interface Getraenk {
    id: number;
    name: string;
    beschreibung: string;
    preis: number;
    kategorie: 'Bier' | 'Kaffee' | 'Milch' | 'Wasser';
    alkoholgehalt?: number;
    menge: number;
    bildUrl: string;
    lagerbestand: number;
}