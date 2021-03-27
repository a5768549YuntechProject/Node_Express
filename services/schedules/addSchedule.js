const sql = /** @type {any} */ (require("sql-template-strings"));
const { query } = require("../../utils/mysql");

const insertStatement = (body) => sql `
INSERT INTO my_schedule (start_date, end_date, event)
VALUES (
    ${body.start_date},
    ${body.end_date},
    ${body.event}
)`;

/**
 * 新增排程
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function addSchedule(req, res) {
    try {
        const [rows, fields] = await query(insertStatement(req.body), req);
        res.status(201).json({ message: "新增成功" });
    } catch (err) {
        req.flash("error", err);
        res.status(409).json({ errors: [err] });
    }
}

module.exports = addSchedule;