const express = require('express');
const router = express.Router();
const companyController = require('../../../controllers/companyController');

router.post('/createCompany', companyController.createCompany);
router.post('/fetchCompany', companyController.fetchCompany);

module.exports = router;
