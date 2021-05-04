// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
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
            datos.push(data1Value);
        } else if (data2Value) {
            datos.push(data2Value);
        } else if (data3Value) {
            datos.push(data3Value);
        }
        if (!datos) {
            return errorThrow(req.t(''), 500, next); // TODO - Crear texto
        }
        const data = await dataConstructor(
            email, 
            namePass, 
            datos,
            length
        );
        const hashedData = await bcrypt.hash(data, 2); // TODO - GUARDAR DATA TOTAL HASHED.
        const password = await passwordConstructor(hashedData, datos, length, difficulty);
        const hashedPassword = await bcrypt.hash(password, 12);
        return res
            .status(201)
            .redirect('/menu'); // FIXME - CAMBIAR A STORAGE
    } catch (err) {
        errorThrow(err, 500, next);
    }
};