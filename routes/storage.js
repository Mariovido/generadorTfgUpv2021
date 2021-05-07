// NODE VANILLA PACKAGES DECLARATIONS
const express = require('express');

// NPM PACKAGES DECLARATIONS
const {check, body} = require('express-validator');
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const Password = require('../models/password');
const Hint = require('../models/hint');
const storageController = require('../controllers/storage');
const isAuth = require('../middleware/is-auth');

// INITIALIZATION
const router = express.Router();
const regex = /^(?=.*[A-Za-z\u00f1\u00d1])[A-Za-z\u00f1\u00d1\d\s]{4,30}$/;
let passwordId = undefined;
let data1Name = '';
let data2Name = '';
let data3Name = '';

// ROUTES ../storage
router.get('/', isAuth, storageController.getStorage);
router.get('/recreate/:passwordId', isAuth, storageController.getRecreate);
router.post(
    '/recreate',
    [
        body('passwordId')
            .custom(async (value, {req}) => {
                passwordId = value;
                const password = await Password.findById({
                    _id: passwordId
                });
                const hints = await Hint.find({
                    _id: {
                        $in: password.hints
                    },
                    isIntroducedByUser: true
                });
                const hintsNames = hints.map(({hintName}) => hintName);
                if (hintsNames[0]) {
                    data1Name = hintsNames[0];
                }
                if (hintsNames[1]) {
                    data2Name = hintsNames[1];
                }
                if (hintsNames[2]) {
                    data3Name = hintsNames[2];
                }
                return true;
            }),
        body('data1Value')
            .matches(regex, 'i')
            .withMessage((value, {req}) => {
                data1Name = '';
                return req.t('recreatePasswordView.validationErrors.dataValue');
            })
            .custom(async (value, {req}) => {
                const password = await Password
                    .findById({
                        _id: passwordId
                    })
                    .populate('hints');
                const hintsId = password.hints.map(({_id}) => _id);
                const hint = await Hint.find({
                    _id: {
                        $in: hintsId
                    },
                    hintName: data1Name
                });
                const doMatch = await bcrypt.compare(value.toLowerCase(), hint[0].hintHash);
                if (!doMatch) {
                    data1Name = '';
                    throw new Error(req.t('recreatePasswordView.validationErrors.dataNotMatch'))
                } 
                return true;
            }),
        body('data2Value')
            .custom(async (value, {req}) => {
                if (data2Name === '') {
                    return true;
                }
                if (!regex.test(value)) {
                    data1Name = '';
                    data2Name = '';
                    throw new Error(req.t('recreatePasswordView.validationErrors.dataValue'));
                }
                const password = await Password
                    .findById({
                        _id: passwordId
                    })
                    .populate('hints');
                const hintsId = password.hints.map(({_id}) => _id);
                const hint = await Hint.find({
                    _id: {
                        $in: hintsId
                    },
                    hintName: data2Name
                });
                const doMatch = await bcrypt.compare(value.toLowerCase(), hint[0].hintHash);
                if (!doMatch) {
                    data1Name = '';
                    data2Name = '';
                    throw new Error(req.t('recreatePasswordView.validationErrors.dataNotMatch'))
                } 
                return true;
            }),
        body('data3Value')
            .custom(async (value, {req}) => {
                if (data3Name === '') {
                    return true;
                }
                if (!regex.test(value)) {
                    data1Name = '';
                    data2Name = '';
                    data3Name = '';
                    throw new Error(req.t('recreatePasswordView.validationErrors.dataValue'));
                }
                const password = await Password
                    .findById({
                        _id: passwordId
                    })
                    .populate('hints');
                const hintsId = password.hints.map(({_id}) => _id);
                const hint = await Hint.find({
                    _id: {
                        $in: hintsId
                    },
                    hintName: data3Name
                });
                const doMatch = await bcrypt.compare(value.toLowerCase(), hint[0].hintHash);
                if (!doMatch) {
                    data1Name = '';
                    data2Name = '';
                    data3Name = '';
                    throw new Error(req.t('recreatePasswordView.validationErrors.dataNotMatch'))
                } 
                return true;
            })
    ], 
    isAuth, 
    storageController.postRecreate);

module.exports = router;