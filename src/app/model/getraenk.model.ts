export interface Getraenk {
  id: number;
  name: string;
  beschreibung: string;
  preis: number;
  kategorie: string;
  menge: number;
  bildUrl: string;
  lagerbestand: number;
  alkoholgehalt?: number;
  bestand: number;
  pfand: number;
  pfandart: string;
}