const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Für die sichere Passwort-Verschlüsselung
const PDFDocument = require('pdfkit');

const app = express();

app.use(cors());
app.use(express.json());

// Datenbank-Verbindung zu eurer Gruppen-DB
const db = mysql.createConnection({
    host: '192.168.110.94',
    user: '26_IT_Grp2',
    password: '5PVxdgwK7RK2W3YpIMbx',
    database: '26_IT_Gruppe2',
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.log('Fehler bei der Verbindung:', err);
    } else {
        console.log('Mit MySQL verbunden');
    }
});


// ======================================================
// PRODUKTE
// ======================================================

// Route zum Laden aller Produkte oder einer Kategorie
app.get('/api/produkt', (req, res) => {
    const kategorie = req.query.kategorie;

    if (kategorie) {
        db.query(
            'SELECT * FROM produkt WHERE hauptkategorie = ?',
            [kategorie],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.json(result);
                }
            }
        );
    } else {
        db.query('SELECT * FROM produkt', (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.json(result);
            }
        });
    }
});


// ======================================================
// LAGERBESTAND SPEICHERN
// ======================================================

app.put('/api/produkt/:id/lagerbestand', (req, res) => {
    const id = req.params.id;
    const { lagerbestand } = req.body;

    const sql = `
        UPDATE produkt
        SET bestand = ?
        WHERE id = ?
    `;

    db.query(sql, [lagerbestand, id], (err, result) => {
        if (err) {
            console.log('Fehler beim Speichern des Lagerbestands:', err);
            return res.status(500).json(err);
        }

        res.json({
            message: 'Lagerbestand wurde gespeichert.'
        });
    });
});


// ======================================================
// AUTHENTIFIZIERUNG (REGISTRIERUNG & LOGIN)
// ======================================================

// 1. REGISTRIEREN (Jetzt mit PLZ und Wohnort)
app.post('/api/register', (req, res) => {
    // Alle Felder aus dem Angular-Frontend entgegennehmen
    const { vorname, nachname, email, adresse, plz, wohnort, telefon, password } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ message: 'Bitte E-Mail und Passwort angeben.' });
    }

    // Passwort verschlüsseln
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Fehler bei der Verschlüsselung.' });
        }

        // SQL-Befehl um 'plz' und 'wohnort' erweitert
        const sqlRegister = `
            INSERT INTO kunde (vorname, nachname, email, adresse, plz, wohnort, telefon, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(
            sqlRegister, 
            [vorname, nachname, email, adresse, plz, wohnort, telefon, hash], 
            (dbErr, result) => {
                if (dbErr) {
                    console.log('Datenbank-Fehler:', dbErr);
                    if (dbErr.errno === 1062) {
                        return res.status(400).json({ message: 'Diese E-Mail-Adresse wird bereits verwendet.' });
                    }
                    return res.status(500).json(dbErr);
                }

                res.status(201).json({ message: 'Registrierung erfolgreich!', kundeId: result.insertId });
            }
        );
    });
});

// 2. EINLOGGEN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Bitte E-Mail und Passwort angeben.' });
    }

    const sqlLogin = 'SELECT * FROM kunde WHERE email = ?';
    db.query(sqlLogin, [email], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Falsche E-Mail-Adresse oder Passwort.' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
            if (bcryptErr) {
                return res.status(500).json({ message: 'Fehler beim Passwort-Vergleich.' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Falsche E-Mail-Adresse oder Passwort.' });
            }

            res.json({
                message: 'Login erfolgreich!',
               user: {
    id: user.id,
    vorname: user.vorname,
    nachname: user.nachname,
    email: user.email,
    adresse: user.adresse,
    plz: user.plz,
    wohnort: user.wohnort,
    telefon: user.telefon
}
            });
        });
    });
});


// ======================================================
// BESTELLUNG & RECHNUNG GENERIEREN
// ======================================================

app.post('/api/bestellung', (req, res) => {

    const {
        bestellteProdukte,
        gesamtpreis,
        datum,
        kundenId,
        lieferadresse
    } = req.body;

    if (!kundenId) {
        return res.status(401).json({
            message: 'Bitte zuerst anmelden.'
        });
    }

    if (!bestellteProdukte || bestellteProdukte.length === 0) {
        return res.status(400).json({
            message: 'Keine Produkte übergeben.'
        });
    }

    if (
        !lieferadresse ||
        !lieferadresse.vorname ||
        !lieferadresse.nachname ||
        !lieferadresse.adresse ||
        !lieferadresse.plz ||
        !lieferadresse.wohnort ||
        !lieferadresse.telefon
    ) {
        return res.status(400).json({
            message: 'Bitte vollständige Lieferadresse angeben.'
        });
    }

    const versandkosten = 4.50;
    const status = 'Eingegangen';

    const sqlBestellung = `
        INSERT INTO bestellung
        (
            kunden_id,
            gesamtpreis,
            datum,
            status,
            liefer_vorname,
            liefer_nachname,
            liefer_adresse,
            liefer_plz,
            liefer_wohnort,
            liefer_telefon,
            versandkosten
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sqlBestellung,
        [
            kundenId,
            gesamtpreis,
            datum,
            status,
            lieferadresse.vorname,
            lieferadresse.nachname,
            lieferadresse.adresse,
            lieferadresse.plz,
            lieferadresse.wohnort,
            lieferadresse.telefon,
            versandkosten
        ],
        (err, result) => {
            if (err) {
                console.log('Fehler beim Speichern der Bestellung:', err);
                return res.status(500).json(err);
            }

            const bestellungId = result.insertId;

            const positionen = bestellteProdukte.map(produkt => [
                bestellungId,
                produkt.getraenk.id,
                produkt.menge,
                produkt.getraenk.preis
            ]);

            const sqlPositionen = `
                INSERT INTO bestellposition
                (bestellung_id, produkt_id, menge, einzelpreis)
                VALUES ?
            `;

            db.query(sqlPositionen, [positionen], (err) => {
                if (err) {
                    console.log('Fehler beim Speichern der Bestellpositionen:', err);
                    return res.status(500).json(err);
                }

                const rechnungsNummer = `RE-2026-${bestellungId}`;

                const sqlRechnung = `
                    INSERT INTO rechnung
                    (rechnungs_nummer, bestellung_id, rechnungs_datum, gesamtbetrag)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    sqlRechnung,
                    [rechnungsNummer, bestellungId, datum, gesamtpreis],
                    (rechnungErr) => {
                        if (rechnungErr) {
                            console.log('Fehler beim Erstellen der Rechnung:', rechnungErr);
                            return res.status(500).json(rechnungErr);
                        }

                        res.json({
                            message: 'Bestellung und Rechnung erfolgreich gespeichert.',
                            bestellung_id: bestellungId,
                            rechnungs_nummer: rechnungsNummer
                        });
                    }
                );
            });
        }
    );
});

// ======================================================
// ALLE BESTELLUNGEN FÜR MITARBEITERPORTAL LADEN
// ======================================================

app.get('/api/bestellungen', (req,res) => {
    const sql = `
    SELECT 
            b.id,
            CONCAT(k.vorname, ' ', k.nachname) AS kunde,
            DATE_FORMAT(b.datum, '%d.%m.%Y') AS datum,
            GROUP_CONCAT(CONCAT(p.name, ' (', bp.menge, 'x)') SEPARATOR ', ') AS artikel,
            SUM(bp.menge) AS menge,
            b.gesamtpreis,
            'Eingegangen' AS status
        FROM bestellung b
        LEFT JOIN kunde k ON b.kunden_id = k.id
        LEFT JOIN bestellposition bp ON bp.bestellung_id = b.id
        LEFT JOIN produkt p ON bp.produkt_id = p.id
        GROUP BY b.id, k.vorname, k.nachname, b.datum, b.gesamtpreis
        ORDER BY b.datum DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Fehler beim Laden der Bestellungen:', err);
            return res.status(500).json({
                message: 'Fehler beim Laden der Bestellungen',
                error: err
            });
        }

        res.json(results);
    });
});


// ======================================================
// RECHNUNGS-PDF GENERIEREN & DOWNLOAD (VERSCHÖNERT)
// ======================================================

app.get('/api/rechnung/pdf/:bestellungId', (req, res) => {
    const { bestellungId } = req.params;

    // Daten mit SQL JOIN holen
    const sqlRechnungsDaten = `
        SELECT r.rechnungs_nummer, DATE_FORMAT(r.rechnungs_datum, '%d.%m.%Y') AS rechnungs_datum, r.gesamtbetrag,
               b.id AS bestellung_id,
               bp.menge, bp.einzelpreis,
               p.name AS produkt_name
        FROM rechnung r
        JOIN bestellung b ON r.bestellung_id = b.id
        JOIN bestellposition bp ON b.id = bp.bestellung_id
        JOIN produkt p ON bp.produkt_id = p.id
        WHERE r.bestellung_id = ?
    `;

    db.query(sqlRechnungsDaten, [bestellungId], (err, results) => {
        if (err || results.length === 0) {
            console.log(err || "Keine Rechnungsdaten gefunden");
            return res.status(404).json({ message: 'Rechnung nicht gefunden.' });
        }

        const ersteZeile = results[0];
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Rechnung_${ersteZeile.rechnungs_nummer}.pdf`);

        doc.pipe(res);

        // Header: Moderner Firmenname und Absender-Info
        doc.fillColor('#2c3e50')
           .fontSize(26)
           .text('DEIN GETRÄNKESHOP', { bold: true });
        
        doc.fontSize(10)
           .fillColor('#7f8c8d')
           .text('Musterstraße 123, 28195 Bremen | support@getraenkeshop.de', { align: 'left' });
        
        doc.moveDown(2);

        // Titel "RECHNUNG"
        doc.fillColor('#2c3e50').fontSize(20).text('RECHNUNG', { bold: true });
        
        // Elegante Trennlinie unter dem Header
        doc.strokeColor('#bdc3c7').lineWidth(1).moveTo(50, 135).lineTo(550, 135).stroke();
        doc.moveDown(1.5);

        // Rechnungsmetadaten im sauberen Key-Value-Format
        doc.fontSize(10).fillColor('#34495e');
        doc.text(`Rechnungsnummer: `, { bold: true, continued: true }).text(ersteZeile.rechnungs_nummer, { bold: false });
        doc.text(`Rechnungsdatum: `, { bold: true, continued: true }).text(ersteZeile.rechnungs_datum, { bold: false });
        doc.text(`Bestellnummer: `, { bold: true, continued: true }).text(`#${ersteZeile.bestellung_id}`, { bold: false });
        
        doc.moveDown(2);

        // Strukturierte Tabelle: Spaltenüberschriften definieren
        const tableTop = 220;
        doc.fontSize(11).fillColor('#2c3e50');
        
        doc.text('Pos.', 50, tableTop, { bold: true });
        doc.text('Artikelbeschreibung', 100, tableTop, { bold: true });
        doc.text('Menge', 320, tableTop, { bold: true, width: 50, align: 'right' });
        doc.text('Einzelpreis', 390, tableTop, { bold: true, width: 70, align: 'right' });
        doc.text('Gesamt', 480, tableTop, { bold: true, width: 70, align: 'right' });

        // Kräftige Trennlinie unter der Tabellenkopfzeile
        doc.strokeColor('#2c3e50').lineWidth(1.5).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Dynamische Tabellenzeilen für die Produkte rendern
        let currentY = tableTop + 25;
        doc.fontSize(10).fillColor('#34495e');

        results.forEach((item, index) => {
            const zeilenBetrag = (item.menge * item.einzelpreis).toFixed(2);
            
            doc.text(`${index + 1}`, 50, currentY);
            doc.text(item.produkt_name, 100, currentY);
            doc.text(`${item.menge}`, 320, currentY, { width: 50, align: 'right' });
            doc.text(`${Number(item.einzelpreis).toFixed(2)} €`, 390, currentY, { width: 70, align: 'right' });
            doc.text(`${zeilenBetrag} €`, 480, currentY, { width: 70, align: 'right' });

            // Dezente Trennlinie zwischen den Posten
            doc.strokeColor('#ecf0f1').lineWidth(1).moveTo(50, currentY + 15).lineTo(550, currentY + 15).stroke();
            
            currentY += 25;
        });

        currentY += 10;

        // Gesamtsummen-Block formatiert auf der rechten Seite ausrichten
        doc.strokeColor('#2c3e50').lineWidth(1.5).moveTo(350, currentY).lineTo(550, currentY).stroke();
        currentY += 10;

        doc.fontSize(14)
           .fillColor('#2c3e50')
           .text(`Gesamtsumme:`, 320, currentY, { bold: true, width: 150, align: 'right' })
           .text(`${Number(ersteZeile.gesamtbetrag).toFixed(2)} €`, 480, currentY, { bold: true, width: 70, align: 'right' });

        // Footer-Hinweis ganz unten platzieren
        doc.fontSize(9)
           .fillColor('#95a5a6')
           .text('Vielen Dank für Ihren Einkauf! Bitte überweisen Sie den Betrag innerhalb von 14 Tagen.', 50, 700, { align: 'center' });

        doc.end();
    });
});


// ======================================================
// SERVER STARTEN
// ======================================================

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});