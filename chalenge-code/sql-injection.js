const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run('CREATE TABLE users(id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  db.run("INSERT INTO users(username,password) VALUES ('alice','pass1'),('bob','pass2'),('admin','supersecret')");
});

app.get('/', (_, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <input name="username" placeholder="username">
      <input name="password" placeholder="password">
      <button>Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // FIX: Gunakan parameterized query dengan placeholder ?
  const q = `SELECT * FROM users WHERE username = ? AND password = ?`;
  
  // Masukkan parameter dalam array [username, password]
  db.all(q, [username, password], (err, rows) => {
    if (err) return res.send('DB error');
    if (rows.length) res.send('Welcome ' + rows[0].username);
    else res.send('Invalid');
  });
});

app.listen(3003, () => console.log('SQLi demo on http://localhost:3003'));