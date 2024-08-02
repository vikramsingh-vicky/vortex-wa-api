const authService = require('../services/authService');
const { validationResult } = require('express-validator');


exports.signup =  async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.json({message: error.array()[0].msg})
    }
    try {
        // console.log(req.body);
        const user = await authService.signup(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
        try {
            const loginData = await authService.login(req.body);
            // console.log(loginData.Token);
            res.json( loginData);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
};

exports.checkUserName = async (req, res) => {
    try {
        const username = await authService.checkUserName(req.body.username);
        res.json(username);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkEmail = async (req, res) => {
    try {
        const email = await authService.checkEmail(req.body.email);
        res.json(email);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCaptcha = async (req, res) => {
    try {
        const captcha = await authService.getCaptcha();
        res.json(captcha);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.json({message: error.array()[0].msg})
    }
    try {
        const changePassword = await authService.changePassword(req.body);
        res.json(changePassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
