// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const Password = require('../models/password');
const Hint = require('../models/hint');
const errorThrow = require('../util/error');
const errorMessage = require('../util/errorMessage');
const infoMessage = require('../util/infoMessage');
const dataConstructor = require('../util/dataConstructor');
const passwordConstructor = require('../util/passwordConstructor');

//INITIALIZATION

// EXPORTS
exports.getGenerator = async (req, res, next) => {
    try {
        const user = await User
            .findById(req.user._id);
        if (!user) {
            return errorThrow(req.t('generalError.noUserFound'), 403, next);
        }
        const error = errorMessage(req);
        let message;
        if (!user.isConfirm) {
            message = req.t('generalInfo.noConfirm');
        } else {
            message = infoMessage(req);
        }
        return res
            .status(200)
            .render('generator/generator', {
                path: '/generator',
                pageTitle: req.t('pageTitles.generatorTitle'),
                navNames: req.t('nav'),
                generatorNames: req.t('generatorView'),
                errorMessage: error,
                validationErrors: [],
                message: message,
                isConfirm: user.isConfirm,
                oldInput: {
                    namePass: '',
                    length: 8,
                    difficulty: {
                        difficultyEasy: 'easy',
                        difficultyMedium: 'medium',
                        difficultyHard: 'hard'
                    },
                    data1: {
                        data1Name: '',
                        data1Value: ''
                    },
                    data2: {
                        data2Name: '',
                        data2Value: ''
                    },
                    data3: {
                        data3Name: '',
                        data3Value: ''
                    }
                }
            });
    } catch (err) {
        return errorThrow(err, 500, next);
    }
};

exports.postGenerator = async (req, res, next) => {
    const email = req.user.email;
    const namePass = req.body.namePass;
    const length = req.body.length[0];
    const difficulty = req.body.difficulty;
    const data1Name = req.body.data1Name;
    const data1Value = req.body.data1Value;
    const data2Name = req.body.data2Name;
    const data2Value = req.body.data2Value;
    const data3Name = req.body.data3Name;
    const data3Value = req.body.data3Value;

    try {
        const user = await User
            .findById(req.user._id)
        if (!user) {
            return errorThrow(req.t('generalError.noUserFound'), 403, next);
        }
        if (!user.isConfirm) {
            return errorThrow(req.t('generalInfo.noConfirm'), 404, next);
        }
        const errors = validationResult(req);
        const message = infoMessage(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('generator/generator', {
                    path: '/generator',
                    pageTitle: req.t('pageTitles.generatorTitle'),
                    navNames: req.t('nav'),
                    generatorNames: req.t('generatorView'),
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array(),
                    message: message,
                    isConfirm: user.isConfirm,
                    oldInput: {
                        namePass: namePass,
                        length: length,
                        difficulty: {
                            difficultyEasy: 'easy',
                            difficultyMedium: 'medium',
                            difficultyHard: 'hard'
                        },
                        data1: {
                            data1Name: data1Name,
                            data1Value: data1Value
                        },
                        data2: {
                            data2Name: data2Name,
                            data2Value: data2Value
                        },
                        data3: {
                            data3Name: data3Name,
                            data3Value: data3Value
                        }
                    }
                });
        }
        let datos = [];
        if (data1Value) {
            datos.push({
                dataName: data1Name,
                dataValue: data1Value
            });
        }
        if (data1Value && data2Value) {
            datos.push({
                dataName: data2Name,
                dataValue: data2Value
            });
        }
        if (data1Value && data2Value && data3Value) {
            datos.push({
                dataName: data3Name,
                dataValue: data3Value
            });
        }
        if (datos.length < 1) {
            return errorThrow(req.t('generatorView.noData'), 500, next);
        }

        const hintsMix = await dataConstructor(
            email, 
            namePass, 
            datos,
            length,
            next
        );
        const hints = hintsMix.hints;
        const hashedData = await bcrypt.hash(hintsMix.finalMix, 2);
        const mixHint = new Hint({
            hintName: '@Mix@',
            hintValue: hintsMix.finalMix,
            hintHash: hashedData,
            isIntroducedByUser: false
        });
        const mixHintSaved = await mixHint.save();
        hints.push(mixHintSaved);

        const password = await passwordConstructor(hashedData, datos, length, difficulty, next);
        const hashedPassword = await bcrypt.hash(password, 12);
        const passwordDatabase = new Password({
            passwordName: namePass,
            passwordHash: hashedPassword,
            length: length,
            difficulty: difficulty,
            hints: hints
        });
        const passwordDatabaseSaved = await passwordDatabase.save();

        user.userPasswords.push(passwordDatabaseSaved);
        await user.save();

        return res
            .status(201)
            .render('generator/show-password', {
                path: '/generator/show-password',
                pageTitle: req.t('pageTitles.showPasswordTitle'),
                navNames: req.t('nav'),
                showPasswordNames: req.t('showPasswordView'),
                errorMessage: null,
                validationErrors: [],
                message: message,
                password: password
            });
    } catch (err) {
        return errorThrow(err, 500, next);
    }
};