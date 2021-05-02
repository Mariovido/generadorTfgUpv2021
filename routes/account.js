// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
const {check, body} = require('express-validator');
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const accountController = require('../controllers/account');
const isAuth = require('../middleware/is-auth');

// INITIALIZATION
const router = express.Router();
const regexAlphaWithSpaces = /^(?=.*[A-Za-z])[A-Za-z\s]{1,}$/;
const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// ROUTES ../account
router.get('/', isAuth, accountController.getAccount);
router.post(
    '/', 
    [
        body('userAlias')
            .isAlphanumeric()
            .withMessage((value, {req}) => {
                return req.t('accountView.validationErrors.alias');
            })
            .isLength({
                min: 4,
                max: 12
            })
            .withMessage((value, {req}) => {
                return req.t('accountView.validationErrors.aliasLength');
            })
            .trim(),
        body('userName')
            .matches(regexAlphaWithSpaces, 'i')
            .withMessage((value, {req}) => {
                return req.t('accountView.validationErrors.name');
            })
            .isLength({
                min: 4,
                max: 12
            })
            .withMessage((value, {req}) => {
                return req.t('accountView.validationErrors.nameLength');
            }),
        body('userAge')
            .isInt()
            .withMessage((value, {req}) => {
                return req.t('accountView.validationErrors.age');
            })
            .custom((value, {req}) => {
                if (value > 100 || value < 1) {
                    throw new Error(req.t('accountView.validationErrors.ageRange'));
                }
                return true;
            }),
        body('userCity')
            .matches(regexAlphaWithSpaces, 'i')
            .withMessage((value, {req}) => {
                return req.t('accountView.validationErrors.city');
            })
            .isLength({
                min: 4,
                max: 30
            })
            .withMessage((value, {req}) => {
                return req.t('accountView.validationErrors.cityLength');
            })
    ],
    isAuth,
    accountController.postAccount
);
router.get('/change-password', isAuth, accountController.getChangePassword);
router.post(
    '/change-password', 
    [   
        check('actualPassword')
            .trim()
            .custom(async (value, {req}) => {
                const doMatch = await bcrypt.compare(value, req.user.password);
                if (!doMatch) {
                    throw new Error(req.t('changePasswordView.validationErrors.actualPassword'));
                }
                return true;
            }),
        check('newPassword', (value, {req}) => {
                return req.t('changePasswordView.validationErrors.newPass');
            })
            .matches(regex, "i")
            .trim(),
        body('confirmNewPassword')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.newPassword) {
                    throw new Error(req.t('changePasswordView.validationErrors.confirmNewPass'));
                }
                return true;
            })
    ],
    isAuth,
    accountController.postChangePassword
);

module.exports = router;