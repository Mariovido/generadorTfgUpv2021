// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const {validationResult} = require('express-validator');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const errorThrow = require('../util/error');
const errorMessage = require('../util/errorMessage');

// EXPORTS
exports.getAccount = async (req, res, next) => {
    const user = await User
        .findById(req.user._id)
        .populate('userInfo');
    const message = errorMessage(req);
    return res
        .status(200)
        .render('account/account', {
            path: '/account',
            pageTitle: req.t('pageTitles.accountTitles.account'),
            navNames: req.t('nav'),
            accountNames: req.t('accountView'),
            errorMessage: message,
            validationErrors: [],
            input: {
                email: user.email,
                userAlias: user.userInfo.userAlias,
                userName: user.userInfo.userName || '',
                userAge: user.userInfo.userAge || '',
                userCity: user.userInfo.userCity || ''
            }
        });
};

exports.postAccount = async (req, res, next) => {
    const userAlias = req.body.userAlias;
    const userName = req.body.userName;
    const userAge = req.body.userAge;
    const userCity = req.body.userCity;

    const user = await User
        .findById(req.user._id)
        .populate('userInfo');
    const errors = validationResult(req);
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
                input: {
                    email: user.email,
                    userAlias: user.userInfo.userAlias,
                    userName: user.userInfo.userName || '',
                    userAge: user.userInfo.userAge || '',
                    userCity: user.userInfo.userCity || ''
                }
            });
    }
    try {
        const userInfo = await UserInfo
            .findById(req.user.userInfo);
        if (!userInfo) {
            errorThrow(err, 500, next);
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

exports.getChangePassword = (req, res, next) => {
};

exports.postChangePassword = (req, res, next) => {
};