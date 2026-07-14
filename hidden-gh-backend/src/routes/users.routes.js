const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getMe, updateMe, saveSite, unsaveSite } = require('../controllers/users.controller');

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);
router.post('/me/saved-sites/:siteId', authenticate, saveSite);
router.delete('/me/saved-sites/:siteId', authenticate, unsaveSite);

module.exports = router;
