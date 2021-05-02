// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const menusController = require('../controllers/menus');
const isAuth = require('../middleware/is-auth');

// INITIALIZATION
const router = express.Router();

// ROUTES ..
router.get('/', menusController.getIndex);
router.get('/menu', isAuth, menusController.getMenu);

module.exports = router;