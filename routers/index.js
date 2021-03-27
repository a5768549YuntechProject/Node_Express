const { Router } = require('express')
const ScheduleRouter = require('./ScheduleRouter');
/** 根路由 */
const RouterRoot = Router();
RouterRoot.use('/schedules', ScheduleRouter);
module.exports = RouterRoot;