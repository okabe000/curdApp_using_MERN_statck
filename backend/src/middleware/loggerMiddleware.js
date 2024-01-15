const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.path}`);
    next();
};

module.exports = loggerMiddleware;
