const mysql = require("mysql2/promise");

const dbOptions = {
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	connectionLimit: 100,
	timezone: "Z",
	multipleStatements: true,
	namedPlaceholders: true,
	typeCast: function (field, next) {
		if (field.type === "TINY" && field.length === 1) {
			return field.string() === "1"; // 1 = true, 0 = false
		} else {
			return next();
		}
	},
};

const db = mysql.createPool(dbOptions);

db.transactionConnection = async () => {
	const connection = await db.getConnection();

	await connection.beginTransaction();

	connection.run = async (fn) => {
		try {
			const result = await fn();
			await connection.commit();
			connection.release();
			return result;
		} catch (error) {
			connection.rollback();
			connection.release();
			throw error;
		}
	};

	return connection;
};

module.exports = db;
