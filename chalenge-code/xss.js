const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let comments = [];

// Helper function untuk sanitasi HTML
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.get('/', (req, res) => {
  // FIX: Menggunakan escapeHtml sebelum menampilkan komentar
  let commentList = comments.map(comment => `<li>${escapeHtml(comment)}</li>`).join('');
  res.send(`
    <html>
      <body>
        <h1>Post a Comment</h1>
        <form method="POST" action="/comment">
          <textarea name="comment"></textarea>
          <button type="submit">Post</button>
        </form>
        <h2>Comments:</h2>
        <ul>${commentList}</ul>
      </body>
    </html>
  `);
});

app.post('/comment', (req, res) => {
  let comment = req.body.comment;
  comments.push(comment);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});