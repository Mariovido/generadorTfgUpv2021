// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS

// INITIALIZATION

// EXPORTS
module.exports = async (error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    if (statusCode == 403) {
        return req.session.destroy((err) => {
            if (err) {
                return errorThrow(err, 500, next);
            }
            return;
        });
    }
    return res.status(statusCode).render(`error/${statusCode}`, {
        path: `/${statusCode}`,
        pageTitle: req.t(`pageTitles.errorsTitle.${statusCode}`),
        navNames: req.t('nav'),
        errorNames: req.t(`${statusCode}View`)
    });
};