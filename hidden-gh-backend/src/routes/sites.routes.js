const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { authenticate } = require('../middleware/auth');
const {
  listSites,
  getSite,
  getSiteImage,
  getGalleryImage,
  createSite,
} = require('../controllers/sites.controller');

// Public reads — matches ExploreScreen / SiteDetailScreen usage
router.get('/', listSites);
router.get('/:id', getSite);
router.get('/:id/image', getSiteImage);
router.get('/:id/gallery/:galleryId', getGalleryImage);

// Admin/content-creation route — protect with auth for now.
// Swap to a role check (e.g. req.user.isAdmin) once you add admin accounts.
router.post('/', authenticate, upload.single('image'), createSite);

module.exports = router;
