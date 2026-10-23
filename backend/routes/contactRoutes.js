const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { createMessage, getMessages } = require('../controllers/contactController');

router.post('/', createMessage);
router.get('/', adminAuth, getMessages);

module.exports = router;
