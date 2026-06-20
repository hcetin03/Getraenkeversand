const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());

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

// Route angepasst auf /api/produkt (Einzahl, passend zu Angular)
app.get('/api/produkt', (req, res) => {
    // Holt den Wert aus "?kategorie=..." (z.B. 'Wasser')
    const kategorie = req.query.kategorie; 

    if (kategorie) {
        // Wenn eine Kategorie übergeben wurde, filtern wir mit WHERE
        db.query('SELECT * FROM 26_IT_Gruppe2.produkt WHERE hauptkategorie = ?', [kategorie], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.json(result);
            }
        });
    } else {
        // Falls kein Parameter übergeben wird, schicken wir einfach alle Produkte
        db.query('SELECT * FROM 26_IT_Gruppe2.produkt', (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.json(result);
            }
        });
    }
});

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});