// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
// const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const menusController = require('../controllers/menus');

// INITIALIZATION
const router = express.Router();

// ROUTES ..
router.get('/', menusController.getIndex);
router.get('/menu', menusController.getMenu);
router.get('/logout', menusController.getLogout);

module.exports = router;