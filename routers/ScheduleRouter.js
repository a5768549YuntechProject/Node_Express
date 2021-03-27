const { Router } = require('express');
const { addSchedule, updateSchedule, removeSchedule } = require('../services/schedules');
const validateScheduleAdd = require('../validators/schedules/validateScheduleAdd');
/** 排程路由 */
const ScheduleRouter = Router();

ScheduleRouter.post('/', validateScheduleAdd, addSchedule);
ScheduleRouter.put('/', updateSchedule);
ScheduleRouter.delete('/', removeSchedule);

module.exports = ScheduleRouter;