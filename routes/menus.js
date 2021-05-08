// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const menusController = require('../controllers/menus');
const isAuth = require('../middleware/is-auth');
const isNotAuth = require('../middleware/is-not-auth');

// INITIALIZATION
const router = express.Router();

// ROUTES ..
router.get('/', isNotAuth, menusController.getIndex);
router.get('/menu', isAuth, menusController.getMenu);
router.get('/guide', isAuth, menusController.getGuide);

module.exports = router;