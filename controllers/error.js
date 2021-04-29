// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS

//INITIALIZATION

// EXPORTS
exports.get500 = (req, res, next) => {
    res.render('error/500', {
        path: '/500',
        pageTitle: req.t('pageTitles.errorsTitle.500'),
        navNames: req.t('nav')
    });
};

exports.get404 = (req, res, next) => {
    res.render('error/404', {
        path: '/404',
        pageTitle: req.t('pageTitles.errorsTitle.404'),
        navNames: req.t('nav')
    });
};