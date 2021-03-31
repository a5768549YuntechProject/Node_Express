const sql = /** @type {any} */ (require("sql-template-strings"));
const { query } = require("../../utils/mysql");

const insertStatement = (body) => sql`
UPDATE my_schedule
SET start_date = ${body.start_date},
end_date = ${body.end_date},
event = ${body.event} 
WHERE id = ${body.id}`;

/**
 * 更新排程
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateSchedule(req, res) {
    try {
        req.body.id = req.params.id;
        console.log(req.body.id);
        const [rows, fields] = await query(insertStatement(req.body), req);
        res.status(200).json({ message: "更新成功" });
    } catch (err) {
        req.flash("error", err);
        res.status(409).json({ errors: [err] });
        console.log(err);
    }
}

module.exports = updateSchedule;
