const sql = /** @type {any} */ (require("sql-template-strings"));
const { query } = require("../../utils/mysql");

const insertStatement = (body) =>
    sql`SELECT * FROM my_schedule Where id = ${body.id}`;

/**
 * 取得清單
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function pickSchedule(req, res) {
    try {
        req.body.id = req.params.id;
        const [rows, fields] = await query(insertStatement(req.body), req);
        res.status(200).json(rows);
    } catch (err) {
        req.flash("error", err);
        res.status(409).json({ errors: [err] });
    }
}

module.exports = pickSchedule;
