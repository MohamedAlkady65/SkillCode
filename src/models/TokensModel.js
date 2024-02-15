const db = require("../db.js");

class TokensModel {
	constructor() {}

	static async addLoginToken({ userId, hashedToken }) {
		const sql = `INSERT INTO tokens (userid,token) VALUES (?,?)`;
		const values = [userId, hashedToken];
		await db.query(sql, values);
	}
	static async removeLoginToken(hashedToken) {
		const sql = `DELETE FROM tokens WHERE token = ? `;
		const values = [hashedToken];
		await db.query(sql, values);
	}

	static async verifyLoginToken({ hashedToken, userId }) {
		const sql = `SELECT userid , token , role FROM  tokens t INNER JOIN users u on t.userid = u.id
		WHERE u.active = true AND token = ? AND userid = ?`;
		const values = [hashedToken, userId];

		const [results] = await db.query(sql, values);
		return results;
	}

	static async addChangePasswordActivationToken({ userId, hashedToken }) {
		const sql = `INSERT INTO change_password_activation_tokens(userid, token) VALUES (?,?) 
		ON DUPLICATE KEY UPDATE token = ?;
		`;
		const values = [userId, hashedToken, hashedToken];
		await db.query(sql, values);
	}
	static async verifyChangePasswordActivationToken({ hashedToken, userId }) {
		const sql = `SELECT userid as id , role  FROM  change_password_activation_tokens t INNER JOIN users u on t.userid = u.id
		WHERE u.active = false AND token = ? AND userid = ?`;
		const values = [hashedToken, userId];
		const [results] = await db.query(sql, values);
		return results;
	}
	static async deleteChangePasswordActivationToken(userId) {
		const sql = `DELETE FROM change_password_activation_tokens WHERE userid = ?`;
		const values = [userId];
		const [results] = await db.query(sql, values);
		return results;
	}
}

module.exports = TokensModel;
