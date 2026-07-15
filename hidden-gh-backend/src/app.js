const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const sitesRoutes = require('./routes/sites.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/users', usersRoutes);

// TODO next: /api/guides, /api/hotels, /api/bookings, /api/notifications
// (same pattern as sites.routes.js — controller + route file each)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

module.exports = app;
