const express = require('express');
const mailerRouter = express.Router();
const mailerDbOperations = require('../cruds/mailer');

mailerRouter.post('/otp', async (req, res, next) => {
    let postedValues = req.body;
    let username = postedValues.username;
    let user_email = postedValues.user_email;
    let otp = postedValues.otp;

    console.log(req.body);
    
    try {
        let results = await mailerDbOperations.sendOtpEmail(username, user_email, otp );
        res.json(results);
    } catch (e) {
        console.log(e); 
        res.sendStatus(500);
    }
});

mailerRouter.post('/forgotPassword', async (req, res, next) => {
    let postedValues = req.body;
    let user_email = postedValues.user_email;
    let otp = postedValues.otp;

    console.log(req.body);
    
    try {
        let results = await mailerDbOperations.sendOtpEmailForgotPass(user_email, otp );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = mailerRouter;