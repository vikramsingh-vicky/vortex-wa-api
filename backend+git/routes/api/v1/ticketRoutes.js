const express = require('express');
const router = express.Router();
const ticketController = require('../../../controllers/ticketController')

router.post('/create',ticketController.create)
router.post('/view',ticketController.view)


module.exports = router;