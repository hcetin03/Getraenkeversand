const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Für die sichere Passwort-Verschlüsselung

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
// AUTHENTIFIZIERUNG (REGISTRIERUNG & LOGIN)
// ======================================================

// 1. REGISTRIEREN
app.post('/api/register', (req, res) => {
    const { email, password } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ message: 'Bitte E-Mail und Passwort angeben.' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Fehler bei der Verschlüsselung.' });
        }

        const sqlRegister = 'INSERT INTO kunde (email, password) VALUES (?, ?)';
        
        db.query(sqlRegister, [email, hash], (dbErr, result) => {
            if (dbErr) {
                console.log(dbErr);
                if (dbErr.errno === 1062) {
                    return res.status(400).json({ message: 'Diese E-Mail-Adresse wird bereits verwendet.' });
                }
                return res.status(500).json(dbErr);
            }

            res.status(201).json({ message: 'Registrierung erfolgreich!', kundeId: result.insertId });
        });
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
                    email: user.email
                }
            });
        });
    });
});


// ======================================================
// BESTELLUNG
// ======================================================

app.post('/api/bestellung', (req, res) => {
    // ANPASSUNG: kundenId wird jetzt optional aus Angular mitgelesen
    const { bestellteProdukte, gesamtpreis, datum, kundenId } = req.body;

    if (!bestellteProdukte || bestellteProdukte.length === 0) {
        return res.status(400).json({
            message: 'Keine Produkte übergeben.'
        });
    }

    const sqlBestellung = `
        INSERT INTO bestellung (kunden_id, gesamtpreis, datum)
        VALUES (?, ?, ?)
    `;

    // ANPASSUNG: Nutzt die kundenId falls eingeloggt, andernfalls null (Gast)
    db.query(sqlBestellung, [kundenId || null, gesamtpreis, datum], (err, result) => {
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
// SERVER STARTEN
// ======================================================

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});