/**
 * 更新排程
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function updateSchedule(req, res) {
    res.status(200).json({ message: '更新成功' });
}

module.exports = updateSchedule;