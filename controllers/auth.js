// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
// const {validationResult} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
// const User = require('../models/user');

// EXPORTS
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: req.t('pageTitles.loginTitle'),
        navNames: req.t('nav')
    });
};

exports.postLogin = (req, res, next) => {
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: req.t('pageTitles.signupTitle'),
        navNames: req.t('nav')
    });
};

exports.postSignup = (req, res, next) => {
};

exports.getResetPassword = (req, res, next) => {
};

exports.postResetPassword = (req, res, next) => {
};

exports.getReestablished = (req, res, next) => {
};

exports.getNewPassword = (req, res, next) => {
};

exports.postNewPassword = (req, res, next) => {
};