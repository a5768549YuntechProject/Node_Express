/**
 * 刪除排程
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function removeSchedule(req, res) {
    res.status(200).json({ message: '刪除成功' });
}

module.exports = removeSchedule;