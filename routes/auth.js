// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
// const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const authController = require('../controllers/auth');

// INITIALIZATION
const router = express.Router();

// ROUTES ..
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reestablished', authController.getReestablished);
router.get('/new-password', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;