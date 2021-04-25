// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const accountController = require('../controllers/account');

// INITIALIZATION
const router = express.Router();
const regexAlphaWithSpaces = /^(?=.*[A-Za-z])[A-Za-z\s]{1,}$/;

// ROUTES ../account
router.get('/', accountController.getAccount);
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
            .matches(regexAlphaWithSpaces)
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
            .matches(regexAlphaWithSpaces)
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
    accountController.postAccount
);
router.get('/change-password', accountController.getChangePassword);
router.post('/change-password', accountController.postChangePassword);

module.exports = router;