// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const errorThrow = require('../util/error');
const errorMessage = require('../util/errorMessage');
const infoMessage = require('../util/infoMessage');

//INITIALIZATION

// EXPORTS
exports.getIndex = async (req, res, next) => {
    const error = errorMessage(req);
    const message = infoMessage(req);
    return res
        .status(200)
        .render('menus/index', {
            path: '/',
            pageTitle: req.t('pageTitles.menusTitles.index'),
            navNames: req.t('nav'),
            indexNames: req.t('indexView'),
            errorMessage: error,
            validationErrors: [],
            message: message
        });
};

exports.getMenu = async (req, res, next) => {
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
            .render('menus/menu', {
                path: '/menu',
                pageTitle: req.t('pageTitles.menusTitles.menu'),
                navNames: req.t('nav'),
                menuNames: req.t('menuView'),
                errorMessage: error,
                validationErrors: [],
                message: message
            });
    } catch (err) {
        return errorThrow(err, 500, next);
    }
};