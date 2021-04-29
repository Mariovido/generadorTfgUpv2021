// NODE VANILLA PACKAGES DECLARATIONS
const crypto = require('crypto');

// NPM PACKAGES DECLARATIONS
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const sendGrid = require('@sendgrid/mail');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const errorThrow = require('../util/error');
const errorMessage = require('../util/errorMessage');

//INITIALIZATION
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

// EXPORTS
exports.getLogin = async (req, res, next) => {
    const message = errorMessage(req);
    return res
        .status(200)
        .render('auth/login', {
            path: '/login',
            pageTitle: req.t('pageTitles.authTitles.login'),
            navNames: req.t('nav'),
            loginNames: req.t('loginView'),
            errorMessage: message,
            validationErrors: [],
            oldInput: {
                email: '',
                password: ''
            }
        });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: req.t('pageTitles.authTitles.login'),
                navNames: req.t('nav'),
                loginNames: req.t('loginView'),
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    email: email,
                    password: password
                }
            });
    }
    try {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return res
                .status(422)
                .render('auth/login', {
                    path: '/login',
                    pageTitle: req.t('pageTitles.authTitles.login'),
                    navNames: req.t('nav'),
                    loginNames: req.t('loginView'),
                    errorMessage: req.t('loginView.validationErrors.emailNotFound'),
                    validationErrors: [],
                    oldInput: {
                        email: email,
                        password: password
                    }
                });
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
                if (err) {
                    errorThrow(err, 500, next)
                }
                return res
                    .status(200)
                    .redirect('/menu');
            });
        }
        return res 
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: req.t('pageTitles.authTitles.login'),
                navNames: req.t('nav'),
                loginNames: req.t('loginView'),
                errorMessage: req.t('loginView.validationErrors.pass'),
                validationErrors: [],
                oldInput: {
                    email: email,
                    password: password
                }
            });
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.getSignup = async (req, res, next) => {
    const message = errorMessage(req);
    return res
        .status(200)
        .render('auth/signup', {
            path: '/signup',
            pageTitle: req.t('pageTitles.authTitles.signup'),
            navNames: req.t('nav'),
            signupNames: req.t('signupView'),
            errorMessage: message,
            validationErrors: [],
            oldInput: {
                email: '',
                alias: '',
                password: '',
                confirmPassword: ''
            }
        });
};

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const alias = req.body.alias;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: req.t('pageTitles.authTitles.signup'),
                navNames: req.t('nav'),
                signupNames: req.t('signupView'),
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    email: email,
                    alias: alias,
                    password: password,
                    confirmPassword: confirmPassword
                }
            });
    }
    try {
        const userInfo = new UserInfo({
            userAlias: alias
        });
        const userInfoSaved = await userInfo.save();
        const hashedPassword = await bcrypt.hash(password, 12);

        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                errorThrow(err, 500, next);
            }
            const token = buffer.toString('hex');
            const user = new User({
                email: email,
                password: hashedPassword,
                userInfo: userInfoSaved,
                confirmToken: token
            });
            await user.save();
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(async (err) => {
                if (err) {
                    errorThrow(err, 500, next);
                }
                await res
                    .status(201)
                    .redirect('/menu');
                const link = process.env.URL + "/confirm/" + token;
                const msg = {
                    to: email,
                    from: process.env.EMAIL_SENDER,
                    subject: req.t('signupView.email.subject'),
                    html: '<h1>' + req.t('signupView.email.html.firstLine') + '</h1>' +
                        "<p>" + req.t('signupView.email.html.secondLine') + '</p>' +
                        link +
                        '<p>' + req.t('signupView.email.html.thirdLine') + '</p>'
                };
                return sendGrid.send(msg);
            });
        });
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.getConfirm = async (req, res, next) => {
    const token = req.params.token; 
    
    try {
        const user = await User.findOne({
            confirmToken: token,
            isConfirm: false
        });
        if (!user) {
            errorThrow(err, 500, next);
        }
        user.isConfirm = true;
        user.confirmToken = undefined;
        await user.save();
        return res
            .status(200)
            .render('auth/confirm', {
                path: '/confirm',
                pageTitle: req.t('pageTitles.authTitles.confirm'),
                navNames: req.t('nav'),
                confirmNames: req.t('confirmView'),
                errorMessage: null,
                validationErrors: [],
                email: user.email,
                emailSender: process.env.EMAIL_SENDER
            });
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.getResetPassword = async (req, res, next) => {
    const message = errorMessage(req);
    return res
        .status(200)
        .render('auth/reset-password', {
            path: '/reset-password',
            pageTitle: req.t('pageTitles.authTitles.resetPassword'),
            navNames: req.t('nav'),
            resetPasswordNames: req.t('resetPasswordView'),
            errorMessage: message,
            validationErrors: [],
            oldInput: {
                email: '',
            }
        });
};

exports.postResetPassword = async (req, res, next) => {
    const email = req.body.email;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/reset-password', {
                path: '/reset-password',
                pageTitle: req.t('pageTitles.authTitles.resetPassword'),
                navNames: req.t('nav'),
                resetPasswordNames: req.t('resetPasswordView'),
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    email: email
                }
            });
    }
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                errorThrow(err, 500, next);
            }
            const token = buffer.toString('hex');
            const user = await User.findOne({
                email: email
            });
            if (!user) {
                errorThrow('resetPasswordView.validationErrors.emailNotFound', 500, next);
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            await user.save();
            await res
                .status(200)
                .render('auth/email-sended', {
                    path: '/email-sended',
                    pageTitle: req.t('pageTitles.authTitles.emailSended'),
                    navNames: req.t('nav'),
                    emailSendedNames: req.t('emailSendedView'),
                    errorMessage: null,
                    validationErrors: [],
                    email: email,
                    emailSender: process.env.EMAIL_SENDER
                });
            const link = process.env.URL + "/new-password/" + token;
            const msg = {
                to: email,
                from: process.env.EMAIL_SENDER,
                subject: req.t('resetPasswordView.email.subject'),
                html: '<p>' + req.t('resetPasswordView.email.html.firstLine') + '</p>' +
                    "<p>" + req.t('resetPasswordView.email.html.secondLine.first') + '<a href="' + link + '">' + req.t('resetPasswordView.email.html.secondLine.link') + '</a>' + req.t('resetPasswordView.email.html.secondLine.second') + '</p>' +
                    '<p>' + req.t('resetPasswordView.email.html.thirdLine') + '</p>' +
                    '<p>' + req.t('resetPasswordView.email.html.fourthLine') + '</p>'
            };
            return sendGrid.send(msg);
        });
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.getNewPassword = async (req, res, next) => {
    const token = req.params.token; 
    
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        });
        if (!user) {
            errorThrow(err, 500, next);
        }
        const message = errorMessage(req);
        return res
            .status(200)
            .render('auth/new-password', {
                path: '/new-password',
                pageTitle: req.t('pageTitles.authTitles.newPassword'),
                navNames: req.t('nav'),
                newPasswordNames: req.t('newPasswordView'),
                errorMessage: message,
                validationErrors: [],
                userId: user._id.toString(),
                token: token
            });
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.postNewPassword = async (req, res, next) => {
    const newPassword = req.body.newPassword;
    const token = req.body.token;
    const userId = req.body.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/new-password', {
                path: '/new-password',
                pageTitle: req.t('pageTitles.authTitles.newPassword'),
                navNames: req.t('nav'),
                newPasswordNames: req.t('newPasswordView'),
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                userId: userId,
                token: token
            });
    }
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        });
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        await res
            .status(200)
            .render('auth/reestablished', {
                path: '/reestablished',
                pageTitle: req.t('pageTitles.authTitles.reestablished'),
                navNames: req.t('nav'),
                reestablishedNames: req.t('reestablishedView'),
                errorMessage: null,
                validationErrors: [],
                emailSender: process.env.EMAIL_SENDER
            });
        const msg = {
            to: user.email,
            from: process.env.EMAIL_SENDER,
            subject: req.t('newPasswordView.email.subject'),
            html: '<h1>' + req.t('newPasswordView.email.html.firstLine') + '</h1>' +
                "<p>" + req.t('newPasswordView.email.html.secondLine') + '</p>' +
                '<p>' + req.t('newPasswordView.email.html.thirdLine') + '</p>'
        };
        return sendGrid.send(msg);
    } catch (err) {
        errorThrow(err, 500, next);
    }
};

exports.postLogout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorThrow(err, 500, next);
        }
        res
            .status(200)
            .redirect('/');
    });
};