// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const errorThrow = require('../util/error');
const errorMessage = require('../util/errorMessage');

// EXPORTS
exports.getLogin = async (req, res, next) => {
    const message = errorMessage(req);
    res.render('auth/login', {
        path: '/login',
        pageTitle: req.t('pageTitles.authTitles.login'),
        navNames: req.t('nav'),
        loginNames: req.t('loginView'),
        errorMessage: message,
        validationErrors: [],
        oldInput: {
            email: '',
            password: ''
        }
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: req.t('pageTitles.authTitles.login'),
                navNames: req.t('nav'),
                loginNames: req.t('loginView'),
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    email: email,
                    password: password
                }
            })
    }
    try {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return res
                .status(422)
                .render('auth/login', {
                    path: '/login',
                    pageTitle: req.t('pageTitles.authTitles.login'),
                    navNames: req.t('nav'),
                    loginNames: req.t('loginView'),
                    errorMessage: req.t('loginView.validationErrors.emailNotFound'),
                    validationErrors: [],
                    oldInput: {
                        email: email,
                        password: password
                    }
                })
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
                if (err) {
                    errorThrow(err, 500, next)
                }
                res.redirect('/menu');
            });
        }
        return res 
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: req.t('pageTitles.authTitles.login'),
                navNames: req.t('nav'),
                loginNames: req.t('loginView'),
                errorMessage: req.t('loginView.validationErrors.pass'),
                validationErrors: [],
                oldInput: {
                    email: email,
                    password: password
                }
            })
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.getSignup = async (req, res, next) => {
    const message = errorMessage(req);
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: req.t('pageTitles.authTitles.signup'),
        navNames: req.t('nav'),
        signupNames: req.t('signupView'),
        errorMessage: message,
        validationErrors: [],
        oldInput: {
            email: '',
            alias: '',
            password: '',
            confirmPassword: ''
        }
    });
};

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const alias = req.body.alias;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: req.t('pageTitles.authTitles.signup'),
                navNames: req.t('nav'),
                signupNames: req.t('signupView'),
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    email: email,
                    alias: alias,
                    password: password,
                    confirmPassword: confirmPassword
                }
            })
    }
    try {
        const userInfo = new UserInfo({
            userAlias: alias
        });
        const userInfoSaved = await userInfo.save();
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword,
            userInfo: userInfoSaved
        });
        await user.save();
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
            if (err) {
                errorThrow(err, 500, next);
            }
            res.redirect('/menu');
        });
    } catch (err) {
        errorThrow(err, 500, next);
    }
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

exports.postLogout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorThrow(err, 500, next);
        }
        res.redirect('/');
    });
};