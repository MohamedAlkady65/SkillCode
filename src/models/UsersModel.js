const db = require("../db.js");

class UsersModel {
	constructor() {}

	static checkEmailExists = async (email) => {
		const [result] = await db.query(
			"SELECT IF(COUNT(*)>0,true,false) as email_exists FROM `users` WHERE email= ?",
			[email]
		);

		return result;
	};

	static async login(email) {
		const sql =
			"SELECT id , email , password , role , active FROM users WHERE active = true AND email= ?";

		const values = [email];

		const [results] = await db.query(sql, values);

		return results;
	}
	static async getUserById(id) {
		const sql = "SELECT id , role  FROM users WHERE id = ?";

		const values = [id];

		const [results] = await db.query(sql, values);

		return results;
	}

	static async addUser(transactionConnection, { email, password, role }) {
		const sql = `INSERT INTO users (id, email, password, role) VALUES (UUID(),?,?,${role})`;
		const values = [email, password];
		await transactionConnection.query(sql, values);
	}

	static async UpdatePasswordById({ userId, password, activation = false }) {
		const sql =
			"UPDATE users SET `password` = ? " +
			(activation ? " , active = true " : "") +
			" WHERE id = ?  ";
		const values = [password, userId];
		await db.query(sql, values);
	}

	static async getResourceId({ resourse, userid }) {
		const sql = `SELECT id FROM ${resourse} WHERE user_id = ?`;
		const values = [userid];
		const [results] = await db.query(sql, values);
		return results;
	}
}

module.exports = UsersModel;
