// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const generatorController = require('../controllers/generator');
const isAuth = require('../middleware/is-auth');

// INITIALIZATION
const router = express.Router();

// ROUTES ../generator
router.get('/', isAuth, generatorController.getGenerator);
router.post(
    '/', 
    [

    ],
    isAuth, 
    generatorController.postGenerator
);

module.exports = router;