const { promisfy } = require("promisfy");

/**
 * @param {import('express').Request} req
 * @param {import('sql-template-strings').SQLStatement} statement
 */
async function query(statement, req) {
    const connection = await promisfy(req.getConnection.bind(req))();

    const [rows, fields] = await promisfy(connection.query.bind(connection))(
        statement
    );

    return [rows, fields];
}

module.exports.query = query;