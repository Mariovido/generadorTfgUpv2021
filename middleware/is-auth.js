// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const errorThrow = require('../util/error');

// INITIALIZATION

// EXPORTS
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return errorThrow(req.t('generalError.noUserLoggedIn'), 403, next);
    }
    return next();
}