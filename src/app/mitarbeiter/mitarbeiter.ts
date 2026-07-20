import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe, DatePipe} from '@angular/common';

type Bestellung = {
    id: number;
    kunde: string;
    datum: string;
    artikel: string;
    menge: number;
    gesamtpreis: number;
    status: string;
};

type Getraenk = {
    id: number;
    name: string;
    kategorie: string;
    hauptkategorie?: string;
    lagerbestand: number;
    bestand?: number;
};

type Kunde = {
    id: number;
    vorname: string;
    nachname: string;
    email: string;
    anzahlBestellungen: number;
    stammkunde: boolean;
};


@Component({
    selector: 'app-mitarbeiter',
    standalone: true,
    imports: [FormsModule, DatePipe, CurrencyPipe],
    templateUrl: './mitarbeiter.html',
    styleUrl: './mitarbeiter.css'
})

export class MitarbeiterComponent implements OnInit{
    passwort = '';
    istEingeloggt = false;
    loginFehler= '';

    bestellungen: Bestellung[] = [];

    getraenke: Getraenk[] = [];
    
    kunden: Kunde[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http.get<Bestellung[]>('http://localhost:3000/api/bestellungen').subscribe((daten) => {
            this.bestellungen = daten;
        });

        this.http.get<Kunde[]>('http://localhost:3000/api/kunden').subscribe((daten) => {
            this.kunden = daten;
        });
        this.http.get<Getraenk[]>('http://localhost:3000/api/produkt').subscribe((daten) => {
    this.getraenke = daten.map(getraenk => ({
        ...getraenk,
        lagerbestand: getraenk.bestand ?? 0
    }));
});
    }

    login(): void{
        if(this.passwort === 'geheim123'){
            this.istEingeloggt = true;
            this.loginFehler = '';
        } else {
            this.loginFehler = 'Falsches Passwort. Bitte versuchen Sie es erneut.';
        }
    }

    bestandErhoehen(getraenk: Getraenk, menge: number): void{
        if (menge > 0) {
            getraenk.lagerbestand += menge;
        }
    }

    bestandSpeichern(getraenk: Getraenk): void{
        if(getraenk.lagerbestand < 0){
            getraenk.lagerbestand = 0;
        }
            this.http.put('http://localhost:3000/api/produkt/' + getraenk.id + '/lagerbestand', {lagerbestand: getraenk.lagerbestand}).subscribe({
                next: () => {
                    alert('Lagerbestand von ' + getraenk.name + ' wurde gespeichert.');
                },
                error: (fehler) => {
                    console.log(fehler);
                    alert('Fehler beim Speichern vom Lagerbestand.');
                }
            });
 }

kategorien = ['Wasser', 'Wein', 'Limo & Saft', 'Kaffee', 'Milch', 'Bier'];

ausgewaehlteKategorie = 'Wasser';
ausgewaehltesGetraenk: Getraenk | null = null;

get produkteDerKategorie(): Getraenk[] {
    return this.getraenke.filter(getraenk => {
        const kategorie = (
            getraenk.hauptkategorie ||
            getraenk.kategorie ||
            ''
        ).toLowerCase();

        const ausgewaehlt = this.ausgewaehlteKategorie.toLowerCase();

        if (ausgewaehlt === 'limo & saft') {
            return kategorie.includes('limo') || kategorie.includes('saft');
        }

        return kategorie.includes(ausgewaehlt);
    });
}

    kategorieWechseln(): void{
        this.ausgewaehltesGetraenk = null;
    }

    rechnungDrucken(bestellung: Bestellung): void {
        window.open(
            `http://localhost:3000/api/rechnung/pdf/${bestellung.id}`, '_blank'
        );
    }

    get stammkunden(): Kunde[]{
        return this.kunden.filter(kunde => kunde.stammkunde);
    }

    newsletterSenden(): void {

    if (this.stammkunden.length === 0) {
        alert('Es gibt momentan keine Stammkunden.');
        return;
    }

   const newsletter = {
    titel: 'Exklusives Angebot für unsere Stammkunden',
    nachricht:
        'Als Dank für Ihre Treue erhalten Sie bei Ihrer nächsten Bestellung 10 % Rabatt auf unser gesamtes Getränkesortiment. Die Aktion gilt bis zum 31.07.2026.'
    };

    this.http.post<{
        message: string;
        anzahlEmpfaenger: number;
    }>(
        'http://localhost:3000/api/newsletter/senden',
        newsletter
    ).subscribe({

        next: (antwort) => {
            alert(
                'Die Nachricht wurde an ' +
                antwort.anzahlEmpfaenger +
                ' Stammkunde(n) gesendet.'
            );
        },

        error: (fehler) => {
            console.error(fehler);

            alert(
                fehler.error?.message ||
                'Die Nachricht konnte nicht gesendet werden.'
            );
        }

    });
}}