import {Component} from '@angular/core';
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
    lagerbestand: number;
};

type Kunde = {
    id: number;
    name: string;
    email: string;
    stammkunde: boolean;
};


@Component({
    selector: 'app-mitarbeiter',
    standalone: true,
    imports: [FormsModule, DatePipe, CurrencyPipe],
    templateUrl: './mitarbeiter.html',
    styleUrl: './mitarbeiter.css'
})

export class MitarbeiterComponent{
    passwort = '';
    istEingeloggt = false;
    loginFehler= '';

    bestellungen: Bestellung[] = [
        {id: 1, kunde: 'Max Mustermann', datum: '2024-06-01', artikel: 'Bier', menge: 2, gesamtpreis: 10.00, status: 'In Bearbeitung'},
        {id: 2, kunde: 'Erika Musterfrau', datum: '2024-06-02', artikel: 'Wein', menge: 3, gesamtpreis: 30.00, status: 'Abgeschlossen'},
        {id: 3, kunde: 'Mia Schmidt', datum: '2024-06-03', artikel: 'Kaffee', menge: 1, gesamtpreis: 5.00, status: 'Versendet'}
    ];

    getraenke: Getraenk[] = [
        {id: 1, name: 'Wasser Classic', kategorie: 'Wasser', lagerbestand: 100},
        {id: 2, name: 'Coca Cola', kategorie: 'Säfte', lagerbestand: 50},
        {id: 3, name: 'Tee', kategorie: 'Tee', lagerbestand: 200}
    ];

    kunden: Kunde[] = [
        {id: 1, name: 'Max Mustermann', email: 'max@beispiel.de', stammkunde: true},
        {id: 2, name: 'Erika Musterfrau', email: 'erika@beispiel.de', stammkunde: false},
        {id: 3, name: 'Mia Schmidt', email: 'mia@beispiel.de', stammkunde: true},
        {id: 4, name: 'Sara Becker', email: 'sara@beispiel.de', stammkunde: true},
    ];

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
        alert('Lagerbestand von ' + getraenk.name + 'wurde auf ' + getraenk.lagerbestand + ' aktualisiert.');
    }

    rechnungDrucken(bestellung: Bestellung): void{
        const rechnung = `Rechnung Getränkeversand

        Rechnungsnummer: ${bestellung.id}
        Kunde: ${bestellung.kunde}
        Datum: ${bestellung.datum}
        Artikel: ${bestellung.artikel}
        Menge: ${bestellung.menge}
        Gesamtpreis: ${bestellung.gesamtpreis.toFixed(2)} €
        Status: ${bestellung.status}

        Vielen Dank für Ihre Bestellung.
        `;

        console.log(rechnung);

        const fenster = window.open('', '_blank');
        if(fenster){
            fenster.document.write('<pre>' + rechnung + '</pre>');
            fenster.document.close();
            fenster.print();
        }
    }
    get stammkunden(): Kunde[]{
        return this.kunden.filter(kunde => kunde.stammkunde);
    }

    newsletterSenden(): void{
        alert('Newsletter wurde an ' + this.stammkunden.length + ' Stammkunden gesendet.');
    }
    }

