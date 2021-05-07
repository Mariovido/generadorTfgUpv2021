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
const passwordConstructor = require('../util/passwordConstructor');

//INITIALIZATION
const PASSWORDS_PER_PAGE = 6;

// EXPORTS
exports.getStorage = async (req, res, next) => {
    const page = +req.query.page || 1;

    try {
        const user = await User
            .findById({
                _id: req.user._id
            })
            .populate('userPasswords');
        if (!user) {
            return errorThrow(req.t('generalError.noUserFound'), 403, next);
        }
        const totalPasswords = user.userPasswords.length;
        const passwordsIds = user.userPasswords.map(({_id}) => _id);
        const passwords = await Password
            .find({
                _id: {
                    $in: passwordsIds
                }
            })
            .skip((page - 1) * PASSWORDS_PER_PAGE)
            .limit(PASSWORDS_PER_PAGE);
        const error = errorMessage(req);
        const message = infoMessage(req);
        return res
            .status(200)
            .render('storage/storage', {
                path: '/storage',
                pageTitle: req.t('pageTitles.savedTitle'),
                navNames: req.t('nav'),
                storageNames: req.t('storageView'),
                errorMessage: error,
                validationErrors: [],
                message: message,
                passwords: passwords,
                currentPage: page,
                hasNextPage: PASSWORDS_PER_PAGE * page < totalPasswords,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage : page - 1,
                lastPage: Math.ceil(totalPasswords/ PASSWORDS_PER_PAGE)
            });    
    } catch (err) {
        return errorThrow(err, 500, next);
    }
};

exports.getRecreate = async (req, res, next) => {
    const passwordId = req.params.passwordId;

    try {
        const password = await Password
            .findById({
                _id: passwordId
            });
        const hints = await Hint.find({
            _id: {
                $in: password.hints
            },
            isIntroducedByUser: true
        });
        const hintsNames = hints.map(({hintName}) => hintName);
        const error = errorMessage(req);
        const message = infoMessage(req);
        return res
            .status(200)
            .render('storage/recreate-password', {
                path: '/storage/recreate-password',
                pageTitle: req.t('pageTitles.recreatePasswordTitle'),
                navNames: req.t('nav'),
                recreatePasswordNames: req.t('recreatePasswordView'),
                errorMessage: error,
                validationErrors: [],
                message: message,
                passwordId: passwordId,
                inputs: {
                    namePass: password.passwordName,
                    length: password.length,
                    difficulty: {
                        difficultyEasy: 'easy',
                        difficultyMedium: 'medium',
                        difficultyHard: 'hard',
                        checked: password.difficulty
                    },
                    hints: hintsNames,
                    hintsValues: []
                }
            }); 
    } catch (err) {
        return errorThrow(err, 500, next);
    }
};

exports.postRecreate = async (req, res, next) => {
    const passwordId = req.body.passwordId;
    const difficulty = req.body.difficultyValue;
    const data1Value = req.body.data1Value;
    const data2Value = req.body.data2Value;
    const data3Value = req.body.data3Value;

    try {
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
        let hintValues = [];
        if (hintsNames[0]) {
            hintValues.push(data1Value);
        }
        if (hintsNames[1]) {
            hintValues.push(data2Value);
        }
        if (hintsNames[2]) {
            hintValues.push(data3Value);
        }
        const errors = validationResult(req);
        const message = infoMessage(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('storage/recreate-password', {
                    path: '/storage/recreate-password',
                    pageTitle: req.t('pageTitles.recreatePasswordTitle'),
                    navNames: req.t('nav'),
                    recreatePasswordNames: req.t('recreatePasswordView'),
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array(),
                    message: message,
                    passwordId: passwordId,
                    inputs: {
                        namePass: password.passwordName,
                        length: password.length,
                        difficulty: {
                            difficultyEasy: 'easy',
                            difficultyMedium: 'medium',
                            difficultyHard: 'hard',
                            checked: difficulty
                        },
                        hints: hintsNames,
                        hintsValues: hintValues
                    }
                });
        }
        let datos = [];
        if (data1Value) {
            datos.push({
                dataName: hintsNames[0],
                dataValue: data1Value
            });
        }
        if (data1Value && data2Value) {
            datos.push({
                dataName: hintsNames[1],
                dataValue: data2Value
            });
        }
        if (data1Value && data2Value && data3Value) {
            datos.push({
                dataName: hintsNames[2],
                dataValue: data3Value
            });
        }
        const mix = await Hint.find({
            _id: {
                $in: password.hints
            },
            isIntroducedByUser: false,
            hintName: '@Mix@'
        });
        const passwordRecreated = await passwordConstructor(mix[0].hintHash, datos, password.length, password.difficulty, next);
        const doMatch = await bcrypt.compare(passwordRecreated, password.passwordHash);
        if (!doMatch) {
            return errorThrow(err, 500, next);
        }
        return res
            .status(200)
            .render('storage/show-password', {
                path: '/storage/show-password',
                pageTitle: req.t('pageTitles.showPasswordTitle'),
                navNames: req.t('nav'),
                showPasswordNames: req.t('showPasswordView'),
                errorMessage: null,
                validationErrors: [],
                message: message,
                password: passwordRecreated
            });
    } catch (err) {
        return errorThrow(err, 500, next);
    }
};