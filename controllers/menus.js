// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
// const {validationResult} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
// const User = require('../models/user');

//INITIALIZATION

// EXPORTS
exports.getIndex = async (req, res, next) => {
    res.render('menus/index', {
        path: '/',
        pageTitle: req.t('pageTitles.menusTitles.index'),
        navNames: req.t('nav')
    });
};

exports.getMenu = async (req, res, next) => {
    res.render('menus/menu', {
        path: '/menu',
        pageTitle: req.t('pageTitles.menusTitles.menu'),
        navNames: req.t('nav')
    });
};