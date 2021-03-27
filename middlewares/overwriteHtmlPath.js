const fs = require('fs');
const publicdir = './public';

/**
 * 覆寫HTML路徑
 * @param {string} rootPath 根路徑
 */
function overwriteHtmlPath(rootPath) {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    const overwriteHtmlPath = (req, res, next) => {
        if (req.path.indexOf('.') === -1 && req.path !== '/') {
            const filePath = rootPath + req.path + '.html';

            fs.stat(filePath, function(err, stat) {
                if (stat) {
                    req.url += '.html';
                }

                next();
            });
        } else {
            next();
        }
    }

    return overwriteHtmlPath;
}

module.exports = overwriteHtmlPath;