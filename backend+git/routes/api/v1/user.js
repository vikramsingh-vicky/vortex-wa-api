const express = require('express');
const router = express.Router();
const fetchuser = require('../../../middleWare/fetchuser');
const userController = require('../../../controllers/userController');

router.post('/fetchUser', fetchuser, userController.fetchUser);

module.exports = router;
