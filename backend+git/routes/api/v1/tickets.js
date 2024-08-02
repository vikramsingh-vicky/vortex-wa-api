const express = require('express');
const router = express.Router();
const ticketController = require('../../../controllers/ticketController')

router.get('/',ticketController.ticketDetail)
router.post('/reply', ticketController.reply)
router.post('/close', ticketController.close)

module.exports = router;