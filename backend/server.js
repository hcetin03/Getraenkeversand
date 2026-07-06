const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const SECRET = 'getraenkeversand_secret';

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
// LAGERBESTAND
// ======================================================

app.put('/api/produkt/:id/lagerbestand', (req, res) => {
    const id = req.params.id;
    const { lagerbestand } = req.body;

    const sql = `UPDATE produkt SET lagerbestand = ? WHERE id = ?`;

    db.query(sql, [lagerbestand, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json({
            message: 'Lagerbestand wurde gespeichert.'
        });
    });
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

app.get('/api/bestellunge', (req, res) => {
    const sql = `
    SELECT
        b.id,
        'Gastkunde' AS kunde,
        b.datum,
        GROUP_CONCAT(p.name SEPARATOR ', ') AS artikel,
        SUM(bp.menge) AS menge,
        b.gesamtpreis,
        'Eingegangen' AS status
    FROM bestellung b
    LEFT JOIN bestellposition bp ON bp.bestellung_id = b.id
    LEFT JOIN produkt p ON bp.produkt_id = p.id
    GROUP BY b.id, b.datum, b.gesamtpreis
    ORDER BY b.datum DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(result);
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
    COUNT(b.id) AS anzahlBestellungen,
    COUNT(b.id) >= 3 AS stammkunde

    FROM kunde k
    LEFT JOIN bestellung b ON b.kunden_id = k.id
    GROUP BY k.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

// =====================================================
// AUTH - LOGIN - Register
// =====================================================

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'E-mail und Passwort erforderlich.' });

    const hash = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO kunde (email, password_hash, rolle) VALUES (?, ?, ?)',
        [email, hash, 'kunde'],
        (err) => {
            if (err) return res.status(500).json({ message: 'Registrierung fehlgeschlagen.' });
            res.json({ message: 'Konto erstellt.' });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM kunde WHERE email =?', [email], async (err, result) => {
        if (err) return res.status(500), json({ message: 'Serverfehler.' });

        if (result.length > 0) {
            const user = result[0];
            const ol = await bcrypt.compare(password, user.password_hash);
            if (!ok) return res.status(406).json({ message: 'Falsches Passwort.' });

            const token = jwt.sign({ id: user.id, rolle: 'kunde' }, SECRET, { expiresIn: '8h' });
            return res.json({ token, rolle: 'kunde' });
        }

        db.query('SELECT * FROM mitarbeiter WHERE email = ?', [email], async (err2, result2) => {
            if (err2) return res.status(500).json({ message: 'Serverfehler.' });
            if (result2.length === 0) return res.status(401).json({ message: 'Benutzer nicht gefunden.' });

            const user = result2[0];
            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) return res.status(401).json({ message: 'Falsches Passwort.' });

            const token = jwt.sign({ id: user.id, rolle: 'mitarbeiter' }, SECRET, { expiresIn: '8h' });
            return res.json({ token, rolle: 'mitarbeiter' });
        });
    });
});

// ======================================================
// SERVER STARTEN
// ======================================================

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});

