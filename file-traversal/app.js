const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <h1>Viewer</h1>
    <p>Try <code>/view?name=note.txt</code></p>
  `);
});

app.get('/view', (req, res) => {
  const name = req.query.name || '';
  // VULN: naive join without normalization & allowlist
  const full = path.join(__dirname, 'files', name);
  fs.readFile(full, 'utf8', (err, data) => {
    if (err) return res.status(404).send('Not found');
    res.type('text/plain').send(data);
  });
});

app.listen(3004, () => console.log('Viewer on http://localhost:3004'));