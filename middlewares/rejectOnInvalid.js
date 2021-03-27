const { validationResult } = require('express-validator');

function rejectOnInvalid(req, res, next) {
    const result = validationResult(req);
    const errors = result.array();

    if (errors.length) {
        res.status(422).json({ errors });
    } else {
        next();
    }
}

module.exports = rejectOnInvalid;