const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'hewan.db');
const SQL_INIT = fs.readFileSync(path.join(__dirname, 'init_db.sql'), 'utf8');

if (!fs.existsSync(DB_FILE)) {
  const tmpdb = new sqlite3.Database(DB_FILE);
  tmpdb.exec(SQL_INIT, (err) => {
    if (err) console.error('Init DB error:', err);
    else console.log('Database inisialisasi dengan init_db.sql');
    tmpdb.close();
  });
}

const db = new sqlite3.Database(DB_FILE);
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.redirect('/login.html');
});
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/hewan', (req, res) => {
  db.all('SELECT * FROM hewan ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/hewan', (req, res) => {
  const { nama, jenis, umur } = req.body;
  if (!nama) return res.status(400).json({ error: 'Field nama wajib diisi' });
  db.run(
    'INSERT INTO hewan (nama, jenis, umur) VALUES (?, ?, ?)',
    [nama, jenis || '', umur || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM hewan WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

app.put('/api/hewan/:id', (req, res) => {
  const { id } = req.params;
  const { nama, jenis, umur } = req.body;
  db.run(
    'UPDATE hewan SET nama = ?, jenis = ?, umur = ? WHERE id = ?',
    [nama, jenis, umur, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
      db.get('SELECT * FROM hewan WHERE id = ?', [id], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

app.delete('/api/hewan/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM hewan WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json({ success: true });
  });
});

app.get('/index.html', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = { username: 'admin', password: '12345' };

  if (username === user.username && password === user.password) {
    res.json({ success: true, message: 'Login berhasil' });
  } else {
    res.status(401).json({ success: false, message: 'Username atau password salah' });
  }
});


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});