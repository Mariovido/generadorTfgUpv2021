// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
// const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const errorController = require('../controllers/error');

// INITIALIZATION
const router = express.Router();

// ROUTES ..
router.get('/500', errorController.get500);
router.use(errorController.get404);

module.exports = router;