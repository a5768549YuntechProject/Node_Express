const { body } = require('express-validator');
const rejectOnInvalid = require('../../middlewares/rejectOnInvalid');

//TODO:express-validator沒有驗datetime的功能，之後記得用regex做
const validateScheduleUpdate = [
    body('start_date'),
    body('end_date'),
    body('event').escape().trim().not().isEmpty(),
    rejectOnInvalid,
];

module.exports = validateScheduleUpdate