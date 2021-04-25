// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const authController = require('../controllers/auth');
const User = require('../models/user');

// INITIALIZATION
const router = express.Router();
const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// ROUTES ..
router.get('/login', authController.getLogin);
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage((value, {req}) => {
                return req.t('loginView.validationErrors.email');
            })
            .normalizeEmail(),
        body('password', (value, {req}) => {
                return req.t('loginView.validationErrors.pass');
            })
            .matches(regex)
            .trim()
    ], 
    authController.postLogin
);
router.get('/signup', authController.getSignup);
router.post(
    '/signup', 
    [
        check('email')
            .isEmail()
            .withMessage((value, {req}) => {
                return req.t('signupView.validationErrors.email');
            })
            .custom(async (value, {req}) => {
                const user = await User.findOne({
                    email: value
                });
                if (user) {
                    return Promise.reject(req.t('signupView.validationErrors.emailExists'));
                }
            })
            .normalizeEmail(),
        body('alias')
            .isAlphanumeric()
            .withMessage((value, {req}) => {
                return req.t('signupView.validationErrors.alias');
            })
            .isLength({
                min: 4,
                max: 12
            })
            .withMessage((value, {req}) => {
                return req.t('signupView.validationErrors.aliasLength');
            })
            .trim(),
        check('password', (value, {req}) => {
                return req.t('signupView.validationErrors.pass');
            })
            .matches(regex, 'i')
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error(req.t('signupView.validationErrors.confirmPass'));
                }
                return true;
            })
    ],
    authController.postSignup
);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reestablished', authController.getReestablished);
router.get('/new-password', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
router.post('/logout', authController.postLogout);

module.exports = router;