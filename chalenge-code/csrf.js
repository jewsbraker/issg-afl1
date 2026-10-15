const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const USERS = {
  alice: { balance: 200 },
  bob: { balance: 50 }
};

app.use((req, res, next) => {
  // FIX: Tambahkan sameSite: 'strict' agar cookie tidak dikirim dari web pihak ketiga
  if (!req.cookies.user) {
    res.cookie('user', 'alice', { 
      httpOnly: true, 
      sameSite: 'strict' 
    });
  }
  next();
});

app.get('/', (req, res) => {
  const currentUser = req.cookies.user || 'alice';
  const user = USERS[currentUser] || USERS.alice;
  res.send(`
    <h1>Bank</h1>
    <p>Logged in as: ${currentUser}</p>
    <p>Balance: $${user.balance}</p>
    <form method="POST" action="/transfer">
      <input name="to" value="bob">
      <input name="amount" value="10">
      <button>Transfer</button>
    </form>
  `);
});

app.post('/transfer', (req, res) => {
  const from = req.cookies.user;
  const to = req.body.to;
  const amt = parseInt(req.body.amount || '0', 10);
  
  if (!USERS[from] || !USERS[to] || isNaN(amt) || amt <= 0) {
    return res.send('Invalid');
  }
  if (USERS[from].balance < amt) return res.send('Insufficient');
  USERS[from].balance -= amt;
  USERS[to].balance += amt;
  res.redirect('/');
});

app.listen(3001, () => console.log('Bank on http://localhost:3001'));