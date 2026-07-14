const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function toUserProfile(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    memberSince: row.member_since,
    isPremium: row.is_premium,
    avatar: row.avatar_data ? `/api/users/${row.id}/avatar` : null,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password, phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, passwordHash, phone || null, location || null]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({ token, user: toUserProfile(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user);
    res.json({ token, user: toUserProfile(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, toUserProfile };
