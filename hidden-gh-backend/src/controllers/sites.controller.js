const pool = require('../config/db');

// Maps a DB row to the shape the frontend's TouristSite type expects.
// image/gallery become API routes rather than raw URLs, but the
// frontend's <Image source={{ uri: item.image }} /> usage doesn't change.
function toTouristSite(row, req) {
  const base = `${req.protocol}://${req.get('host')}`;
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    description: row.description,
    longDescription: row.long_description,
    category: row.category_id,
    region: row.region,
    openingHours: row.opening_hours,
    entryFee: row.entry_fee,
    rating: Number(row.rating),
    reviews: row.review_count,
    image: row.image_data ? `${base}/api/sites/${row.id}/image` : null,
    isPremium: row.is_premium,
    coordinates:
      row.latitude != null && row.longitude != null
        ? { latitude: Number(row.latitude), longitude: Number(row.longitude) }
        : undefined,
    lat: row.latitude != null ? Number(row.latitude) : undefined,
    lng: row.longitude != null ? Number(row.longitude) : undefined,
    phone: row.phone,
    website: row.website,
    highlights: row.highlights || [],
    premiumContent: row.is_premium ? row.premium_content : undefined,
  };
}

async function listSites(req, res, next) {
  try {
    const { category, region, search } = req.query;

    const conditions = [];
    const values = [];

    if (category && category !== 'all') {
      values.push(category);
      conditions.push(`category_id = $${values.length}`);
    }

    if (region) {
      values.push(region);
      conditions.push(`region = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(name ILIKE $${values.length} OR location ILIKE $${values.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT * FROM tourist_sites ${whereClause} ORDER BY created_at DESC`,
      values
    );

    res.json(result.rows.map((row) => toTouristSite(row, req)));
  } catch (err) {
    next(err);
  }
}

async function getSite(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tourist_sites WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }

    const site = toTouristSite(result.rows[0], req);

    const gallery = await pool.query(
      'SELECT id FROM site_gallery WHERE site_id = $1 ORDER BY sort_order ASC',
      [id]
    );
    const base = `${req.protocol}://${req.get('host')}`;
    site.gallery = gallery.rows.map((g) => `${base}/api/sites/${id}/gallery/${g.id}`);

    res.json(site);
  } catch (err) {
    next(err);
  }
}

async function getSiteImage(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT image_data, image_mime_type FROM tourist_sites WHERE id = $1',
      [id]
    );

    const row = result.rows[0];
    if (!row || !row.image_data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', row.image_mime_type || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(row.image_data);
  } catch (err) {
    next(err);
  }
}

async function getGalleryImage(req, res, next) {
  try {
    const { galleryId } = req.params;
    const result = await pool.query(
      'SELECT image_data, image_mime_type FROM site_gallery WHERE id = $1',
      [galleryId]
    );

    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', row.image_mime_type || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(row.image_data);
  } catch (err) {
    next(err);
  }
}

async function createSite(req, res, next) {
  try {
    const {
      name, location, description, longDescription, category, region,
      openingHours, entryFee, isPremium, premiumContent,
      latitude, longitude, phone, website, highlights,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'name and category are required' });
    }

    const imageBuffer = req.file ? req.file.buffer : null;
    const imageMime = req.file ? req.file.mimetype : null;

    const result = await pool.query(
      `INSERT INTO tourist_sites
        (name, location, description, long_description, category_id, region,
         opening_hours, entry_fee, is_premium, premium_content,
         latitude, longitude, phone, website, highlights, image_data, image_mime_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [
        name, location, description, longDescription || null, category, region || null,
        openingHours || null, entryFee || null, isPremium === 'true' || isPremium === true,
        premiumContent || null, latitude || null, longitude || null, phone || null,
        website || null, highlights ? JSON.parse(highlights) : null,
        imageBuffer, imageMime,
      ]
    );

    res.status(201).json(toTouristSite(result.rows[0], req));
  } catch (err) {
    next(err);
  }
}

module.exports = { listSites, getSite, getSiteImage, getGalleryImage, createSite, toTouristSite };
