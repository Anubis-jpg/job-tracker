const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('jobs.db');

app.use(bodyParser.json());
app.use(express.static('public'));

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, userId INTEGER, company TEXT, role TEXT, status TEXT)');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) res.send({ error: 'User exists' });
    else res.send({ success: true });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (row) res.send(row);
    else res.send({ error: 'Invalid login' });
  });
});

app.post('/jobs', (req, res) => {
  const { userId, company, role, status } = req.body;
  db.run('INSERT INTO jobs (userId, company, role, status) VALUES (?, ?, ?, ?)', [userId, company, role, status], function(err) {
    res.send({ id: this.lastID });
  });
});

app.get('/jobs/:userId', (req, res) => {
  db.all('SELECT * FROM jobs WHERE userId = ?', [req.params.userId], (err, rows) => {
    res.send(rows);
  });
});

app.delete('/jobs/:id', (req, res) => {
  db.run('DELETE FROM jobs WHERE id = ?', [req.params.id]);
  res.send({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});