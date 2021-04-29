module.exports = async (error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    if (statusCode == 403) {
        req.session.destroy((err) => {
            if (err) {
                errorThrow(err, 500, next);
            }
        });
    }
    res.status(statusCode).render(`error/${statusCode}`, {
        path: `/${statusCode}`,
        pageTitle: req.t(`pageTitles.errorsTitle.${statusCode}`),
        navNames: req.t('nav')
    });
};