module.exports = async (err, status, next) => {
    const error = new Error(err);
    if (status) {
        error.statusCode = status;
    } else {
        error.statusCode = 500;
    }
    return next(error);
}