const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authController = require('../../../controllers/authController');

router.post('/signup', [
    body('name','Minimum 3 characters required').isLength({min:3}),
    body('username','Minimum 5 characters required').isLength({min:5}),
    body('email','Enter a valid email').isEmail(),
    body('mobile','Enter a valid mobile number').isMobilePhone(),
    body('password','Minimum 8 characters required').isLength({min:8}),
], authController.signup);

router.post('/login', [
    body('username','Minimum 5 characters required').isLength({min:5}),
    body('password','Minimum 5 characters required').isLength({min:5}),

], authController.login);

router.post('/chkusername', authController.checkUserName);
router.post('/chkemail', authController.checkEmail);
router.get('/captcha', authController.getCaptcha);
router.post('/rePass',[
    body('password','Minimum 8 characters required').isLength({min:8}),
    body('username','Please enter valid Email ID').isEmail(),
], authController.changePassword);


module.exports = router;
