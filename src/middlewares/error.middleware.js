/**
 * Error response middleware for 404 not found.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.notFound = function notFound(req, res) {
    res.status(404).json({
        code: 404,
        message: 'Ooops, route not found',
    });
};

/**
 * Error response middleware for handling all app errors except generic errors.
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
// eslint-disable-next-line no-unused-vars
module.exports.appErrorHandler = function appErrorHandler(err, req, res, next) {
    try {
        if (err.code && typeof err.code === 'number') {
            // return responseProvider(res, null, err.message, err.code);
            return res.status(err.code).json({
                code: err.code,
                message: err.message,
            });
        }
    } catch (error) {
        next(err);
    }
};

/**
 * Generic error response middleware for internal server errors.
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
module.exports.genericErrorHandler = function genericErrorHandler(err, req, res, next) {
    try {
        // return responseProvider(res, null, err.message, 500);
        return res.status(500).json({
            code: 500,
            data: '',
            message: err.message,
        });
    } catch (error) {
        next(err);
    }
};
