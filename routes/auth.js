// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const isNotAuth = require('../middleware/is-not-auth');
const User = require('../models/user');

// INITIALIZATION
const router = express.Router();
const regex = /^(?=.*[A-Za-z\u00f1\u00d1])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\u00f1\u00d1\d@$!%*#?&]{8,}$/;

// ROUTES ..
router.get('/login', isNotAuth, authController.getLogin);
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage((value, {req}) => {
                return req.t('loginView.validationErrors.email');
            })
            .toLowerCase()
            .trim(),
        body('password', (value, {req}) => {
                return req.t('loginView.validationErrors.pass');
            })
            .matches(regex)
            .trim()
    ], 
    isNotAuth,
    authController.postLogin
);
router.get('/signup', isNotAuth, authController.getSignup);
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
            .toLowerCase()
            .trim(),
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
    isNotAuth,
    authController.postSignup
);
router.get('/confirm/:token', authController.getConfirm);
router.get('/reset-password', isNotAuth, authController.getResetPassword);
router.post(
    '/reset-password', 
    [
        check('email')
            .isEmail()
            .withMessage((value, {req}) => {
                return req.t('resetPasswordView.validationErrors.email');
            })
            .toLowerCase()
            .custom(async (value, {req}) => {
                const user = await User.findOne({
                    email: value
                });
                if (!user) {
                    return Promise.reject(req.t('resetPasswordView.validationErrors.emailNotFound'));
                }
            })
            .trim()
    ],
    isNotAuth,
    authController.postResetPassword
);
router.get('/new-password/:token', isNotAuth, authController.getNewPassword);
router.post(
    '/new-password', 
    [
        check('newPassword', (value, {req}) => {
                return req.t('newPasswordView.validationErrors.newPass');
            })
            .matches(regex, 'i')
            .trim(),
        body('confirmNewPassword')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.newPassword) {
                    throw new Error(req.t('newPasswordView.validationErrors.confirmNewPass'));
                }
                return true;
            })
    ],
    isNotAuth,
    authController.postNewPassword
);
router.post('/logout', isAuth, authController.postLogout);

module.exports = router;