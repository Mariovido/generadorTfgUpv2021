// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
// const {validationResult} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
// const User = require('../models/user');

// EXPORTS
exports.getAccount = (req, res, next) => {
    res.render('account/account', {
        path: '/account',
        pageTitle: req.t('pageTitles.accountTitles.account'),
        navNames: req.t('nav')
    });
};

exports.postAccount = (req, res, next) => {
};

exports.getChangePassword = (req, res, next) => {
};

exports.postChangePassword = (req, res, next) => {
};