// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
const {check, body} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const Password = require('../models/password');
const generatorController = require('../controllers/generator');
const isAuth = require('../middleware/is-auth');

// INITIALIZATION
const router = express.Router();
const regex = /^(?=.*[A-Za-z\u00f1\u00d1])[A-Za-z\u00f1\u00d1\d\s]{4,30}$/;
let data1Name = false;
let data1Value = false;
let data2Name = false;
let data2Value = false;
let data3Name = false;

// ROUTES ../generator
router.get('/', isAuth, generatorController.getGenerator);
router.post(
    '/', 
    [
        body('namePass')
            .matches(regex, 'i')
            .withMessage((value, {req}) => {
                return req.t('generatorView.validationErrors.namePass');
            })
            .custom(async (value, {req}) => {
                const user = await User
                    .findById({
                        _id: req.user._id
                    })
                const password = await Password
                    .find({
                        _id: {
                            $in: user.userPasswords
                        },
                        passwordName: value
                    });
                if (password.length > 0) {
                    return Promise.reject(req.t('generatorView.validationErrors.namePassExists'));
                }
                return true;
            }),
        body('length')
            .isInt()
            .withMessage((value, {req}) => {
                return req.t('generatorView.validationErrors.length');
            })
            .custom((value, {req}) => {
                if (value > 32 || value < 8) {
                    throw new Error(req.t('generatorView.validationErrors.lengthRange'));
                }
                return true;
            }),
        body('difficulty')
            .isAlpha()
            .withMessage((value, {req}) => {
                return req.t('generatorView.validationErrors.difficulty');
            })
            .custom((value, {req}) => {
                if (value !== 'easy' && value !== 'medium' && value !== 'hard') {
                    throw new Error(req.t('generatorView.validationErrors.difficulty'));
                }
                return true;
            }),

        body('data1Name')
            .matches(regex, 'i')
            .withMessage((value, {req}) => {
                return req.t('generatorView.validationErrors.dataName');
            })
            .custom((value, {req}) => {
                data1Name = true;
                return true;
            }),
        body('data1Value')
            .matches(regex, 'i')
            .withMessage((value, {req}) => {
                return req.t('generatorView.validationErrors.dataValue');
            })
            .custom((value, {req}) => {
                data1Value = true;
                return true;
            }),
        body('data2Name')
            .custom((value, {req}) => {
                if (value === '') {
                    return true;
                }
                if (!data1Name || !data1Value) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    throw new Error(req.t('generatorView.validationErrors.dataEmpty'))
                }
                if (!regex.test(value)) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    throw new Error(req.t('generatorView.validationErrors.dataName'));
                }
                data2Name = true;
                return true;
            }),
        body('data2Value')
            .custom((value, {req}) => {
                if (value === '' && !data2Name) {
                    return true;
                }
                if (!data1Name || !data1Value || !data2Name) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    data2Value = false;
                    throw new Error(req.t('generatorView.validationErrors.dataEmpty'))
                }
                if (!regex.test(value)) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    data2Value = false;
                    throw new Error(req.t('generatorView.validationErrors.dataValue'));
                }
                data2Value = true;
                return true;
            }),
        body('data3Name')
            .custom((value, {req}) => {
                if (value === '') {
                    return true;
                }
                if (!data1Name || !data1Value || !data2Name || !data2Value) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    data2Value = false;
                    data3Name = false;
                    throw new Error(req.t('generatorView.validationErrors.dataEmpty'))
                }
                if (!regex.test(value)) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    data2Value = false;
                    data3Name = false;
                    throw new Error(req.t('generatorView.validationErrors.dataName'));
                }
                data3Name = true;
                return true;
            }),
        body('data3Value')
            .custom((value, {req}) => {
                if ((value === '' && !data3Name || (data2Name && data2Value))) {
                    return true;
                }
                if (!data1Name || !data1Value || !data2Name || !data2Value || !data3Name) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    data2Value = false;
                    data3Name = false;
                    data3Value = false;
                    throw new Error(req.t('generatorView.validationErrors.dataEmpty'))
                }
                if (!regex.test(value)) {
                    data1Name = false;
                    data1Value = false;
                    data2Name = false;
                    data2Value = false;
                    data3Name = false;
                    data3Value = false;
                    throw new Error(req.t('generatorView.validationErrors.dataValue'));
                }
                data3Value = true;
                return true;
            })
    ],
    isAuth, 
    generatorController.postGenerator
);

module.exports = router;