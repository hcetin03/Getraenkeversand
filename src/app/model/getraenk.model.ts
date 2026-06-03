export interface Getraenk {
    id: number;
    name: string;
    beschreibung: string;
    preis: number;
    kategorie: string;
    alkoholgehalt?: number;
    bestand: number;
    bildUrl?: string;
}