const express = require('express');
const { Database } = require('sqlite3');

const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, company TEXT, role TEXT, status TEXT)');});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
    if (err) return
      res.status(500).send('err');
      res.send({ id: this.lastID });
    }
  );
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (user) res.send(user);
    else res.status(401).send('Invalid credentials');
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
  db.run('DELETE FROM jobs WHERE id = ?', req.params.id);
    res.send("Job deleted");
  });