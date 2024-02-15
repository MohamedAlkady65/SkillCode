const db = require("../db");

class SessionsModel {
	static async add(session) {
		const sql = `INSERT INTO sessions(class_id, date_time) VALUES (?,?)`;
		const values = [session.classId, session.dateTime];
		await db.query(sql, values);
	}
	static async delete(id) {
		const sql = `DELETE FROM sessions WHERE id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);

		return result;
	}
	static async getOfClass(classId) {
		const sql = `SELECT id, class_id, date_time FROM sessions WHERE class_id = ?`;
		const values = [classId];
		const [sessions] = await db.query(sql, values);
		return sessions;
	}
	static checkExists = async (id) => {
		const sql = `SELECT COUNT(id) as count FROM sessions WHERE id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	};
}

module.exports = SessionsModel;
