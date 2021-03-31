const sql = /** @type {any} */ (require("sql-template-strings"));
const { query } = require("../../utils/mysql");

const insertStatement =  sql`SELECT * FROM my_schedule ORDER BY id DESC`;

/**
 * 取得清單
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listSchedule(req, res) {
    try {
        const [rows, fields] = await query(insertStatement, req);
        res.status(200).json(rows);
    } catch (err) {
        req.flash("error", err);
        res.status(409).json({ errors: [err] });
    }
}

module.exports = listSchedule;
