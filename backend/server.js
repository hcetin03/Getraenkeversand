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
        return;
    }
        console.log('Mit MySQL verbunden');

        //Nachrichtentabelle erstellen
        const sql = `
            CREATE TABLE IF NOT EXISTS kundennachricht (
                id INT AUTO_INCREMENT PRIMARY KEY,
                kunden_id INT NOT NULL,
                titel VARCHAR(150) NOT NULL,
                nachricht TEXT NOT NULL,
                erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        db.query(sql, (tableErr) => {
            if (tableErr) {
                console.error(
                    'Fehler beim Erstellen der Nachrichtentabelle:',
                    tableErr
                );
            } else {
                console.log('Nachrichtentabelle ist bereit');
            }
        });

          // Mitarbeitertabelle für die Mitarbeiterverwaltung erstellen
        const sqlMitarbeiterTabelle = `
        CREATE TABLE IF NOT EXISTS mitarbeiter_verwaltung (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vorname VARCHAR(100) NOT NULL,
        nachname VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        passwort VARCHAR(255) NOT NULL,
        rolle VARCHAR(50) NOT NULL DEFAULT 'Mitarbeiter',
        aktiv TINYINT(1) NOT NULL DEFAULT 1,
        erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
         )
    `;

db.query(sqlMitarbeiterTabelle, (mitarbeiterTableErr) => {
    if (mitarbeiterTableErr) {
        console.error(
            'Fehler beim Erstellen der Mitarbeitertabelle:',
            mitarbeiterTableErr
        );
    } else {
        console.log('Mitarbeitertabelle ist bereit');
    }
});
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
            COALESCE(NULLIF(b.status, ''), 'Eingegangen') AS status
        FROM bestellung b
        LEFT JOIN kunde k ON b.kunden_id = k.id
        LEFT JOIN bestellposition bp ON bp.bestellung_id = b.id
        LEFT JOIN produkt p ON bp.produkt_id = p.id
        GROUP BY b.id, k.vorname, k.nachname, b.datum, b.gesamtpreis, b.status
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
// KUNDEN UND STAMMKUNDEN LADEN
// ======================================================

app.get('/api/kunden', (req, res) => {
    const sql = `
        SELECT
            k.id,
            k.vorname,
            k.nachname,
            k.email,
            COUNT(b.id) AS anzahlBestellungen,
            CASE
                WHEN COUNT(b.id) >= 3 THEN 1
                ELSE 0
            END AS stammkunde
        FROM kunde k
        LEFT JOIN bestellung b ON b.kunden_id = k.id
        GROUP BY
            k.id,
            k.vorname,
            k.nachname,
            k.email
        ORDER BY k.nachname, k.vorname
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Fehler beim Laden der Kunden:', err);

            return res.status(500).json({
                message: 'Kunden konnten nicht geladen werden.'
            });
        }

        const kunden = results.map(kunde => ({
            ...kunde,
            anzahlBestellungen: Number(kunde.anzahlBestellungen),
            stammkunde: Number(kunde.stammkunde) === 1
        }));

        res.json(kunden);
    });
});

// ======================================================
// NEWSLETTER ALS INTERNE KUNDENNACHRICHT
// ======================================================

app.post('/api/newsletter/senden', (req, res) => {
    const { titel, nachricht } = req.body;

    if (!titel || !titel.trim() || !nachricht || !nachricht.trim()) {
        return res.status(400).json({
            message: 'Titel und Nachricht fehlen.'
        });
    }

    // Zuerst alle vorherigen Newsletter löschen
    const deleteSql = `
        DELETE FROM kundennachricht
    `;

    db.query(deleteSql, (deleteErr) => {
        if (deleteErr) {
            console.error(
                'Fehler beim Löschen der alten Nachricht:',
                deleteErr
            );

            return res.status(500).json({
                message: 'Die alte Nachricht konnte nicht gelöscht werden.'
            });
        }

        // Danach die neue Nachricht für alle aktuellen Stammkunden speichern
        const insertSql = `
            INSERT INTO kundennachricht
            (
                kunden_id,
                titel,
                nachricht
            )

            SELECT
                k.id,
                ?,
                ?

            FROM kunde k

            JOIN bestellung b
                ON b.kunden_id = k.id

            GROUP BY k.id

            HAVING COUNT(DISTINCT b.id) >= 3
        `;

        db.query(
            insertSql,
            [
                titel.trim(),
                nachricht.trim()
            ],
            (insertErr, result) => {
                if (insertErr) {
                    console.error(
                        'Fehler beim Speichern des Newsletters:',
                        insertErr
                    );

                    return res.status(500).json({
                        message:
                            'Die neue Nachricht konnte nicht gespeichert werden.'
                    });
                }

                res.status(201).json({
                    message:
                        'Die vorherige Nachricht wurde ersetzt.',
                    anzahlEmpfaenger:
                        result.affectedRows
                });
            }
        );
    });
});

// ======================================================
// NEUESTE NACHRICHT EINES KUNDEN LADEN
// ======================================================

app.get('/api/kunden/:kundeId/nachrichten', (req, res) => {
    const kundeId = Number(req.params.kundeId);

    if (!Number.isInteger(kundeId) || kundeId <= 0) {
        return res.status(400).json({
            message: 'Ungültige Kunden-ID.'
        });
    }

    const sql = `
        SELECT
            id,
            titel,
            nachricht,
            DATE_FORMAT(
                erstellt_am,
                '%d.%m.%Y um %H:%i Uhr'
            ) AS erstellt_am
        FROM kundennachricht
        WHERE kunden_id = ?
        ORDER BY id DESC
        LIMIT 1
    `;

    db.query(sql, [kundeId], (err, results) => {
        if (err) {
            console.error(
                'Fehler beim Laden der Nachricht:',
                err
            );

            return res.status(500).json({
                message:
                    'Die Nachricht konnte nicht geladen werden.'
            });
        }

        res.json(results);
    });
});

// ======================================================
// MITARBEITERVERWALTUNG
// ======================================================


// ------------------------------------------------------
// ALLE MITARBEITER LADEN
// ------------------------------------------------------

app.get('/api/mitarbeiter', (req, res) => {
    const sql = `
        SELECT
            id,
            vorname,
            nachname,
            email,
            rolle,
            aktiv,
            DATE_FORMAT(
                erstellt_am,
                '%d.%m.%Y'
            ) AS erstellt_am
        FROM mitarbeiter_verwaltung
        ORDER BY nachname, vorname
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(
                'Fehler beim Laden der Mitarbeiter:',
                err
            );

            return res.status(500).json({
                message:
                    'Die Mitarbeiter konnten nicht geladen werden.',
                    fehler: err.sqlMessage,
                    code: err.code
            });
        }

        const mitarbeiter = results.map(eintrag => ({
            ...eintrag,
            aktiv: Number(eintrag.aktiv) === 1
        }));

        res.json(mitarbeiter);
    });
});


// ------------------------------------------------------
// NEUEN MITARBEITER ANLEGEN
// ------------------------------------------------------

app.post('/api/mitarbeiter', (req, res) => {
    const {
        vorname,
        nachname,
        email,
        passwort,
        rolle,
        aktiv
    } = req.body;

    if (
        !vorname?.trim() ||
        !nachname?.trim() ||
        !email?.trim() ||
        !passwort?.trim()
    ) {
        return res.status(400).json({
            message:
                'Bitte Vorname, Nachname, E-Mail und Passwort angeben.'
        });
    }

    bcrypt.hash(passwort.trim(), 10, (hashErr, passwortHash) => {
        if (hashErr) {
            console.error(
                'Fehler beim Verschlüsseln des Passworts:',
                hashErr
            );

            return res.status(500).json({
                message:
                    'Das Passwort konnte nicht verarbeitet werden.'
            });
        }

        const sql = `
            INSERT INTO mitarbeiter_verwaltung
            (
                vorname,
                nachname,
                email,
                passwort,
                rolle,
                aktiv
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                vorname.trim(),
                nachname.trim(),
                email.trim().toLowerCase(),
                passwortHash,
                rolle?.trim() || 'Mitarbeiter',
                aktiv === false ? 0 : 1
            ],
            (dbErr, result) => {
                if (dbErr) {
                    console.error(
                        'Fehler beim Anlegen des Mitarbeiters:',
                        dbErr
                    );

                    if (dbErr.errno === 1062) {
                        return res.status(400).json({
                            message:
                                'Diese E-Mail-Adresse wird bereits verwendet.'
                        });
                    }

                    return res.status(500).json({
                        message:
                            'Der Mitarbeiter konnte nicht angelegt werden.'
                    });
                }

                res.status(201).json({
                    message:
                        'Mitarbeiter wurde erfolgreich angelegt.',
                    id: result.insertId
                });
            }
        );
    });
});


// ------------------------------------------------------
// MITARBEITER BEARBEITEN
// ------------------------------------------------------

app.put('/api/mitarbeiter/:id', (req, res) => {
    const id = Number(req.params.id);

    const {
        vorname,
        nachname,
        email,
        passwort,
        rolle,
        aktiv
    } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Ungültige Mitarbeiter-ID.'
        });
    }

    if (
        !vorname?.trim() ||
        !nachname?.trim() ||
        !email?.trim()
    ) {
        return res.status(400).json({
            message:
                'Bitte Vorname, Nachname und E-Mail angeben.'
        });
    }

    const mitarbeiterSpeichern = (passwortHash = null) => {
        let sql;
        let werte;

        if (passwortHash) {
            sql = `
                UPDATE mitarbeiter_verwaltung
                SET
                    vorname = ?,
                    nachname = ?,
                    email = ?,
                    passwort = ?,
                    rolle = ?,
                    aktiv = ?
                WHERE id = ?
            `;

            werte = [
                vorname.trim(),
                nachname.trim(),
                email.trim().toLowerCase(),
                passwortHash,
                rolle?.trim() || 'Mitarbeiter',
                aktiv === false ? 0 : 1,
                id
            ];
        } else {
            sql = `
                UPDATE mitarbeiter
                SET
                    vorname = ?,
                    nachname = ?,
                    email = ?,
                    rolle = ?,
                    aktiv = ?
                WHERE id = ?
            `;

            werte = [
                vorname.trim(),
                nachname.trim(),
                email.trim().toLowerCase(),
                rolle?.trim() || 'Mitarbeiter',
                aktiv === false ? 0 : 1,
                id
            ];
        }

        db.query(sql, werte, (dbErr, result) => {
            if (dbErr) {
                console.error(
                    'Fehler beim Bearbeiten des Mitarbeiters:',
                    dbErr
                );

                if (dbErr.errno === 1062) {
                    return res.status(400).json({
                        message:
                            'Diese E-Mail-Adresse wird bereits verwendet.'
                    });
                }

                return res.status(500).json({
                    message:
                        'Der Mitarbeiter konnte nicht bearbeitet werden.'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        'Der Mitarbeiter wurde nicht gefunden.'
                });
            }

            res.json({
                message:
                    'Mitarbeiter wurde erfolgreich bearbeitet.'
            });
        });
    };

    if (passwort?.trim()) {
        bcrypt.hash(
            passwort.trim(),
            10,
            (hashErr, passwortHash) => {
                if (hashErr) {
                    console.error(
                        'Fehler beim Verschlüsseln des Passworts:',
                        hashErr
                    );

                    return res.status(500).json({
                        message:
                            'Das Passwort konnte nicht verarbeitet werden.'
                    });
                }

                mitarbeiterSpeichern(passwortHash);
            }
        );
    } else {
        mitarbeiterSpeichern();
    }
});


// ------------------------------------------------------
// MITARBEITER LÖSCHEN
// ------------------------------------------------------

app.delete('/api/mitarbeiter/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Ungültige Mitarbeiter-ID.'
        });
    }

    const sql = `
        DELETE FROM mitarbeiter_verwaltung
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(
                'Fehler beim Löschen des Mitarbeiters:',
                err
            );

            return res.status(500).json({
                message:
                    'Der Mitarbeiter konnte nicht gelöscht werden.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message:
                    'Der Mitarbeiter wurde nicht gefunden.'
            });
        }

        res.json({
            message:
                'Mitarbeiter wurde erfolgreich gelöscht.'
        });
    });
});

// ======================================================
// BESTELLUNGEN EINES EINGELOGGTEN KUNDEN LADEN
// ======================================================

app.get('/api/kunden/:kundeId/bestellungen', (req, res) => {
    const kundeId = Number(req.params.kundeId);

    if (!Number.isInteger(kundeId) || kundeId <= 0) {
        return res.status(400).json({
            message: 'Ungültige Kunden-ID.'
        });
    }

    const sql = `
        SELECT
            b.id,
            DATE_FORMAT(
                b.datum,
                '%d.%m.%Y'
            ) AS datum,

            GROUP_CONCAT(
                CONCAT(
                    p.name,
                    ' (',
                    bp.menge,
                    'x)'
                )
                ORDER BY p.name
                SEPARATOR ', '
            ) AS artikel,

            COALESCE(
                SUM(bp.menge),
                0
            ) AS menge,

            b.gesamtpreis,

            COALESCE(
                NULLIF(b.status, ''),
                'Eingegangen'
            ) AS status,

            r.rechnungs_nummer

        FROM bestellung b

        LEFT JOIN bestellposition bp
            ON bp.bestellung_id = b.id

        LEFT JOIN produkt p
            ON p.id = bp.produkt_id

        LEFT JOIN rechnung r
            ON r.bestellung_id = b.id

        WHERE b.kunden_id = ?

        GROUP BY
            b.id,
            b.datum,
            b.gesamtpreis,
            b.status,
            r.rechnungs_nummer

        ORDER BY
            b.datum DESC,
            b.id DESC
    `;

    db.query(sql, [kundeId], (err, results) => {
        if (err) {
            console.error(
                'Fehler beim Laden der Kundenbestellungen:',
                err
            );

            return res.status(500).json({
                message:
                    'Die Bestellungen konnten nicht geladen werden.'
            });
        }

        const bestellungen = results.map(bestellung => ({
            ...bestellung,
            menge: Number(bestellung.menge),
            gesamtpreis: Number(bestellung.gesamtpreis)
        }));

        res.json(bestellungen);
    });
});

// ======================================================
// LIEFERSTATUS EINER BESTELLUNG ÄNDERN
// ======================================================

app.put('/api/bestellungen/:id/status', (req, res) => {
    const bestellungId = Number(req.params.id);
    const { status } = req.body;

    const erlaubteStatuswerte = [
        'Eingegangen',
        'In Bearbeitung',
        'Versendet',
        'Zugestellt'
    ];

    if (
        !Number.isInteger(bestellungId) ||
        bestellungId <= 0
    ) {
        return res.status(400).json({
            message: 'Ungültige Bestellnummer.'
        });
    }

    if (!erlaubteStatuswerte.includes(status)) {
        return res.status(400).json({
            message: 'Ungültiger Lieferstatus.'
        });
    }

    const sql = `
        UPDATE bestellung
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, bestellungId],
        (err, result) => {
            if (err) {
                console.error(
                    'Fehler beim Ändern des Lieferstatus:',
                    err
                );

                return res.status(500).json({
                    message:
                        'Der Lieferstatus konnte nicht gespeichert werden.'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        'Die Bestellung wurde nicht gefunden.'
                });
            }

            res.json({
                message:
                    'Der Lieferstatus wurde erfolgreich gespeichert.',
                status: status
            });
        }
    );
});

// ======================================================
// KUNDENPROFIL LADEN UND BEARBEITEN
// ======================================================

// Profil eines Kunden laden
app.get('/api/kunden/:kundeId/profil', (req, res) => {
    const kundeId = Number(req.params.kundeId);

    if (!Number.isInteger(kundeId) || kundeId <= 0) {
        return res.status(400).json({
            message: 'Ungültige Kunden-ID.'
        });
    }

    const sql = `
        SELECT
            id,
            vorname,
            nachname,
            email,
            adresse,
            plz,
            wohnort,
            telefon
        FROM kunde
        WHERE id = ?
    `;

    db.query(sql, [kundeId], (err, results) => {
        if (err) {
            console.error(
                'Fehler beim Laden des Kundenprofils:',
                err
            );

            return res.status(500).json({
                message:
                    'Das Kundenprofil konnte nicht geladen werden.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Der Kunde wurde nicht gefunden.'
            });
        }

        res.json(results[0]);
    });
});


// Profil eines Kunden bearbeiten
app.put('/api/kunden/:kundeId/profil', (req, res) => {
    const kundeId = Number(req.params.kundeId);

    const {
        vorname,
        nachname,
        email,
        adresse,
        plz,
        wohnort,
        telefon
    } = req.body;

    if (!Number.isInteger(kundeId) || kundeId <= 0) {
        return res.status(400).json({
            message: 'Ungültige Kunden-ID.'
        });
    }

    if (
        !vorname?.trim() ||
        !nachname?.trim() ||
        !email?.trim()
    ) {
        return res.status(400).json({
            message:
                'Bitte Vorname, Nachname und E-Mail-Adresse angeben.'
        });
    }

    const sql = `
        UPDATE kunde
        SET
            vorname = ?,
            nachname = ?,
            email = ?,
            adresse = ?,
            plz = ?,
            wohnort = ?,
            telefon = ?
        WHERE id = ?
    `;

    const werte = [
        vorname.trim(),
        nachname.trim(),
        email.trim().toLowerCase(),
        adresse?.trim() || '',
        plz?.trim() || '',
        wohnort?.trim() || '',
        telefon?.trim() || '',
        kundeId
    ];

    db.query(sql, werte, (err, result) => {
        if (err) {
            console.error(
                'Fehler beim Bearbeiten des Kundenprofils:',
                err
            );

            if (err.errno === 1062) {
                return res.status(400).json({
                    message:
                        'Diese E-Mail-Adresse wird bereits verwendet.'
                });
            }

            return res.status(500).json({
                message:
                    'Das Kundenprofil konnte nicht gespeichert werden.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Der Kunde wurde nicht gefunden.'
            });
        }

        res.json({
            message:
                'Das Profil wurde erfolgreich gespeichert.',

            kunde: {
                id: kundeId,
                vorname: vorname.trim(),
                nachname: nachname.trim(),
                email: email.trim().toLowerCase(),
                adresse: adresse?.trim() || '',
                plz: plz?.trim() || '',
                wohnort: wohnort?.trim() || '',
                telefon: telefon?.trim() || ''
            }
        });
    });
});

// ======================================================
// SERVER STARTEN
// ======================================================

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});