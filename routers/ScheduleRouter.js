const { Router } = require("express");
const {
    addSchedule,
    updateSchedule,
    removeSchedule,
    listSchedule,
    pickSchedule,
} = require("../services/schedules");
const validateScheduleAdd = require("../validators/schedules/validateScheduleAdd");
/** 排程路由 */
const ScheduleRouter = Router();

ScheduleRouter.get("/", listSchedule);
ScheduleRouter.post("/", validateScheduleAdd, addSchedule);
ScheduleRouter.put("/:id", updateSchedule);
ScheduleRouter.delete("/", removeSchedule);

ScheduleRouter.get("/:id", pickSchedule);

module.exports = ScheduleRouter;
