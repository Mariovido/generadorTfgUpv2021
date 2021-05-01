// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const sendGrid = require('@sendgrid/mail');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const errorThrow = require('../util/error');
const errorMessage = require('../util/errorMessage');
const infoMessage = require('../util/infoMessage');

//INITIALIZATION
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

// EXPORTS
exports.getAccount = async (req, res, next) => {
    try {
        const user = await User
            .findById(req.user._id)
            .populate('userInfo');
        if (!user) {
            return errorThrow(req.t('generalError.noUserFound'), 403, next);
        }
        const error = errorMessage(req);
        const message = infoMessage(req);
        return res
            .status(200)
            .render('account/account', {
                path: '/account',
                pageTitle: req.t('pageTitles.accountTitles.account'),
                navNames: req.t('nav'),
                accountNames: req.t('accountView'),
                errorMessage: error,
                validationErrors: [],
                message: message,
                input: {
                    email: user.email,
                    userAlias: user.userInfo.userAlias,
                    userName: user.userInfo.userName || '',
                    userAge: user.userInfo.userAge || '',
                    userCity: user.userInfo.userCity || ''
                }
            });
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.postAccount = async (req, res, next) => {
    const userAlias = req.body.userAlias;
    const userName = req.body.userName;
    const userAge = req.body.userAge;
    const userCity = req.body.userCity;
    try {
        const user = await User
            .findById(req.user._id)
            .populate('userInfo');
        if (!user) {
            return errorThrow(req.t('generalError.noUserFound'), 403, next);
        }
        const errors = validationResult(req);
        const message = infoMessage(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('account/account', {
                    path: '/account',
                    pageTitle: req.t('pageTitles.accountTitles.account'),
                    navNames: req.t('nav'),
                    accountNames: req.t('accountView'),
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array(),
                    message: message,
                    input: {
                        email: user.email,
                        userAlias: user.userInfo.userAlias,
                        userName: user.userInfo.userName || '',
                        userAge: user.userInfo.userAge || '',
                        userCity: user.userInfo.userCity || ''
                    }
                });
        }
        const userInfo = await UserInfo
            .findById(req.user.userInfo);
        if (!userInfo) {
            errorThrow(req.t('generalError.noUserFound'), 500, next);
        }
        userInfo.userAlias = userAlias;
        userInfo.userName = userName;
        userInfo.userAge = userAge;
        userInfo.userCity = userCity;
        await userInfo.save();
        return res
            .status(201)
            .redirect('/account');
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.getChangePassword = async (req, res, next) => {
    try {
        const user = await User
            .findById(req.user._id)
        if (!user) {
            return errorThrow(req.t('generalError.noUserFound'), 403, next);
        }
        const error = errorMessage(req);
        const message = infoMessage(req);
        return res
            .status(200)
            .render('account/change-password', {
                path: '/account/change-password',
                pageTitle: req.t('pageTitles.accountTitles.changePassword'),
                navNames: req.t('nav'),
                changePasswordNames: req.t('changePasswordView'),
                errorMessage: error,
                validationErrors: [],
                message: message,
                oldInput: {
                    newPassword: '',
                    confirmNewPassword: ''
                }
            });
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.postChangePassword = async (req, res, next) => {
    const actualPassword = req.body.actualPassword;
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;

    const errors = validationResult(req);
    const message = infoMessage(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('account/change-password', {
                path: '/account/change-password',
                pageTitle: req.t('pageTitles.accountTitles.changePassword'),
                navNames: req.t('nav'),
                changePasswordNames: req.t('changePasswordView'),
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                message: message,
                oldInput: {
                    actualPassword: actualPassword,
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword
                }
            });
    }
    try {
        const user = await User
            .findById(req.user._id)
        if (!user) {
            return errorThrow(req.t('generalError.noUserFound'), 403, next);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();
        await res
            .status(200)
            .redirect('/account?message=' + req.t('changePasswordView.successfully'));
        const msg = {
            to: user.email,
            from: process.env.EMAIL_SENDER,
            subject: req.t('changePasswordView.email.subject'),
            html: '<h1>' + req.t('changePasswordView.email.html.firstLine') + '</h1>' +
                "<p>" + req.t('changePasswordView.email.html.secondLine') + '</p>' +
                '<p>' + req.t('changePasswordView.email.html.thirdLine') + '</p>'
        };
        return sendGrid.send(msg);
    } catch (err) {
        errorThrow(err, 500, next);
    }
};