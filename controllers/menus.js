// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
// const {validationResult} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
// const User = require('../models/user');

// EXPORTS
exports.getIndex = async (req, res, next) => {
    res.render('menus/index', {
        path: '/',
        pageTitle: req.t('pageTitles.indexTitle'),
        navNames: req.t('nav')
    });
};

exports.getMenu = async (req, res, next) => {
    res.render('menus/menu', {
        path: '/menu',
        pageTitle: req.t('pageTitles.menuTitle'),
        navNames: req.t('nav')
    });
};

exports.getLogout = async (req, res, next) => {
};