// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
// const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const accountController = require('../controllers/account');

// INITIALIZATION
const router = express.Router();

// ROUTES ../account
router.get('/', accountController.getAccount);
router.post('/', accountController.postAccount);
router.get('/change-password', accountController.getChangePassword);
router.post('/change-password', accountController.postChangePassword);

module.exports = router;