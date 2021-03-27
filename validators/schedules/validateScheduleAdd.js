const { body } = require('express-validator');
const rejectOnInvalid = require('../../middlewares/rejectOnInvalid');

const validateScheduleAdd = [
    body('start_date').isDate(),
    body('end_date').isDate(),
    body('event').escape().trim().not().isEmpty(),
    rejectOnInvalid,
];

module.exports = validateScheduleAdd;