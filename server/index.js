import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

const createEmptyPortfolio = () => ({
  balance: 0,
  totalProfit: 0,
  allocations: {
    savings: 20,
    indexFunds: {
      total: 50,
      subs: [
        { name: 'S&P 500', percentage: 70 },
        { name: 'Nasdaq 100', percentage: 30 },
      ],
    },
    crypto: {
      total: 30,
      subs: [
        { name: 'BTC', percentage: 60 },
        { name: 'ETH', percentage: 40 },
      ],
    },
  },
  holdings: [],
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      portfolio TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`,
  );
});

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
  }

  const createdAt = new Date().toISOString();
  const portfolio = JSON.stringify(createEmptyPortfolio());

  const stmt = db.prepare(
    'INSERT INTO users (username, email, password, portfolio, created_at) VALUES (?, ?, ?, ?, ?)',
  );
  stmt.run(username, email, password, portfolio, createdAt, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res
          .status(409)
          .json({ success: false, message: 'El ID de terminal o email ya existe.' });
      }
      console.error('DB register error:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Error al registrar en la base de datos.' });
    }
    return res.json({ success: true, message: 'Terminal registrada con éxito.' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Faltan credenciales.' });
  }

  db.get(
    'SELECT username, email, password, portfolio FROM users WHERE username = ?',
    [username],
    (err, row) => {
      if (err) {
        console.error('DB login error:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Error al validar credenciales.' });
      }
      if (!row || row.password !== password) {
        return res
          .status(401)
          .json({ success: false, message: 'Credenciales de acceso inválidas.' });
      }

      const user = {
        username: row.username,
        email: row.email,
        portfolio: JSON.parse(row.portfolio),
      };

      return res.json({ success: true, message: 'Acceso concedido.', user });
    },
  );
});

app.post('/api/portfolio/update', (req, res) => {
  const { username, amount, alloc } = req.body || {};
  if (!username || typeof amount !== 'number' || !alloc) {
    return res
      .status(400)
      .json({ success: false, message: 'Datos de actualización incompletos.' });
  }

  db.get(
    'SELECT username, email, password, portfolio FROM users WHERE username = ?',
    [username],
    (err, row) => {
      if (err || !row) {
        console.error('DB portfolio fetch error:', err);
        return res
          .status(500)
          .json({ success: false, message: 'No se pudo cargar el portfolio.' });
      }

      const currentPortfolio = JSON.parse(row.portfolio);
      currentPortfolio.balance += amount;
      currentPortfolio.allocations = alloc;

      const newHoldings = [...currentPortfolio.holdings];
      const addValue = (symbol, val) => {
        const existing = newHoldings.find((h) => h.symbol === symbol);
        if (existing) {
          existing.value += val;
        } else {
          newHoldings.push({ symbol, amount: val / 100, value: val });
        }
      };

      const cryptoVal = (amount * alloc.crypto.total) / 100;
      alloc.crypto.subs.forEach((sub) => {
        addValue(sub.name, (cryptoVal * sub.percentage) / 100);
      });

      const indexVal = (amount * alloc.indexFunds.total) / 100;
      alloc.indexFunds.subs.forEach((sub) => {
        addValue(sub.name, (indexVal * sub.percentage) / 100);
      });

      currentPortfolio.holdings = newHoldings;

      const updatedPortfolioJson = JSON.stringify(currentPortfolio);
      db.run(
        'UPDATE users SET portfolio = ? WHERE username = ?',
        [updatedPortfolioJson, username],
        (updateErr) => {
          if (updateErr) {
            console.error('DB portfolio update error:', updateErr);
            return res
              .status(500)
              .json({ success: false, message: 'No se pudo actualizar el portfolio.' });
          }

          const user = {
            username: row.username,
            email: row.email,
            portfolio: currentPortfolio,
          };
          return res.json({ success: true, user });
        },
      );
    },
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

