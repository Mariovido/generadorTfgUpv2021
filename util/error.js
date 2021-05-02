// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS

// INITIALIZATION

// EXPORTS
module.exports = (err, status, next) => {
    const error = new Error(err);
    if (status) {
        error.statusCode = status;
    } else {
        error.statusCode = 500;
    }
    return next(error);
}