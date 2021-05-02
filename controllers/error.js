// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS

//INITIALIZATION

// EXPORTS
exports.get500 = (req, res, next) => {
    return res
        .status(500)
        .render('error/500', {
            path: '/500',
            pageTitle: req.t('pageTitles.errorsTitle.500'),
            navNames: req.t('nav'),
            errorNames: req.t('500View')
        });
};

exports.get403 = (req, res, next) => {
    return res
        .status(403)
        .render('error/403', {
            path: '/403',
            pageTitle: req.t('pageTitles.errorsTitle.403'),
            navNames: req.t('nav'),
            errorNames: req.t('403View')
        });
};

exports.get404 = (req, res, next) => {
    return res
        .status(404)
        .render('error/404', {
            path: '/404',
            pageTitle: req.t('pageTitles.errorsTitle.404'),
            navNames: req.t('nav'),
            errorNames: req.t('404View')
        });
};