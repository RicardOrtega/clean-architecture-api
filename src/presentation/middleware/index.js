function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.details || [err.message],
            data: null
        });
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format',
            data: null
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
    });
}

function requestLogger(req, res, next) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
}

function validateContentType(req, res, next) {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.is('application/json')) {
            return res.status(400).json({
                success: false,
                message: 'Content-Type must be application/json',
                data: null
            });
        }
    }
    next();
}

module.exports = {
    errorHandler,
    requestLogger,
    validateContentType
};