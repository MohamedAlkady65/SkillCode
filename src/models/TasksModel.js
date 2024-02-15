const db = require("../db");

class TasksModel {
	static async add(task) {
		const sql = `INSERT INTO tasks(session_id, description) VALUES (?,?)`;
		const values = [task.sessionId, task.description];
		await db.query(sql, values);
	}
	static async getOfSession(sessionId) {
		const sql = `SELECT id,session_id, description FROM tasks WHERE session_id = ?`;
		const values = [sessionId];
		const [tasks] = await db.query(sql, values);
		return tasks;
	}
	static async delete(sessionId) {
		const sql = `DELETE FROM tasks WHERE session_id = ?`;
		const values = [sessionId];
		const [result] = await db.query(sql, values);

		return result;
	}
	static async checkTaskForSession(sessionId) {
		const sql = `SELECT COUNT(id) as count FROM tasks WHERE session_id = ?`;
		const values = [sessionId];
		const [result] = await db.query(sql, values);
		return result;
	}
}

module.exports = TasksModel;
