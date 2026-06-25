const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

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
// BESTELLUNG
// ======================================================

app.post('/api/bestellung', (req, res) => {

    const { bestellteProdukte, gesamtpreis, datum } = req.body;

    if (!bestellteProdukte || bestellteProdukte.length === 0) {
        return res.status(400).json({
            message: 'Keine Produkte übergeben.'
        });
    }

    const sqlBestellung = `
        INSERT INTO bestellung (kunden_id, gesamtpreis, datum)
        VALUES (?, ?, ?)
    `;

    db.query(sqlBestellung, [null, gesamtpreis, datum], (err, result) => {

        if (err) {
            console.log(err);
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
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message: 'Bestellung erfolgreich gespeichert.',
                bestellung_id: bestellungId
            });

        });

    });

});

// ======================================================
// KUNDEN / STAMMKUNDEN
// ======================================================

app.get('/api/kunden', (req, res) => {
    const sql = `
    SELECT
    k.id,
    k.vorname,
    k.nachname,
    k.email
    COUNT(b.id) AS anzahl_bestellungen,
    COUNT(b.id) >= 3 AS stammkunde

    FROM kunde k
    LEFT JOIN bestellung b ON b.kunden_id = k.id
    GROUP BY k.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } 
            res.json(result);
    });
});



// ======================================================
// SERVER STARTEN
// ======================================================

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});