module.exports = async (error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).render(`error/${statusCode}`, {
        path: `/${statusCode}`,
        pageTitle: req.t(`pageTitles.errorsTitle.${statusCode}`),
        navNames: req.t('nav')
    });
};