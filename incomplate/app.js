const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Simulate user account with balance
let user = { balance: 100 };

// Simulate books with fixed prices
let books = [
  { id: 1, title: "Book 1", price: 20 },
  { id: 2, title: "Book 2", price: 30 },
];

// Route to display books and user balance
app.get('/', (req, res) => {
  let bookList = books.map(book => `
    <li>
      ${book.title} - Price: $${book.price}
      <form method="POST" action="/buy/${book.id}">
        <input type="hidden" name="price" value="${book.price}">
        <button type="submit">Buy</button>
      </form>
    </li>
  `).join('');

  res.send(`
    <html>
      <body>
        <h1>Book Store</h1>
        <p>Your balance: $${user.balance}</p>
        <ul>${bookList}</ul>
      </body>
    </html>
  `);
});

// Route to handle book purchase
app.post('/buy/:id', (req, res) => {
  let bookId = parseInt(req.params.id);
  let bookPrice = parseInt(req.body.price);

  if (user.balance >= bookPrice) {
    user.balance -= bookPrice;
    res.send(`<p>Purchase successful! New balance: $${user.balance}</p><a href="/">Go back</a>`);
  } else {
    res.send(`<p>Insufficient balance!</p><a href="/">Go back</a>`);
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});