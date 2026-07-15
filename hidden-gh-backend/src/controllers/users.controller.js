const pool = require('../config/db');
const { toUserProfile } = require('./auth.controller');

async function getMe(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];

    const [savedCount, bookingCount, reviewCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM saved_sites WHERE user_id = $1', [user.id]),
      pool.query("SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status = 'Completed'", [user.id]),
      pool.query('SELECT COUNT(*) FROM reviews WHERE user_id = $1', [user.id]),
    ]);

    const profile = toUserProfile(user);
    profile.stats = {
      sitesVisited: Number(bookingCount.rows[0].count),
      savedSites: Number(savedCount.rows[0].count),
      toursBooked: Number(bookingCount.rows[0].count),
      reviews: Number(reviewCount.rows[0].count),
    };

    res.json(profile);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { name, phone, location } = req.body;

    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        location = COALESCE($3, location)
       WHERE id = $4
       RETURNING *`,
      [name || null, phone || null, location || null, req.user.id]
    );

    res.json(toUserProfile(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

async function saveSite(req, res, next) {
  try {
    const { siteId } = req.params;
    await pool.query(
      `INSERT INTO saved_sites (user_id, site_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.user.id, siteId]
    );
    res.status(201).json({ saved: true });
  } catch (err) {
    next(err);
  }
}

async function unsaveSite(req, res, next) {
  try {
    const { siteId } = req.params;
    await pool.query('DELETE FROM saved_sites WHERE user_id = $1 AND site_id = $2', [
      req.user.id,
      siteId,
    ]);
    res.json({ saved: false });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, saveSite, unsaveSite };
