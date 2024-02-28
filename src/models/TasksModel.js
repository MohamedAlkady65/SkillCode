const db = require("../db");

class TasksModel {
	static async add(transactionConnection, task) {
		const sql = `INSERT INTO tasks(session_id, description) VALUES (?,?)`;
		const values = [task.sessionId, task.description];
		const [result] = await transactionConnection.query(sql, values);
		return result;
	}
	static async getOfSession(sessionId) {
		const sql = `SELECT id , description FROM tasks WHERE session_id = ?`;
		const values = [sessionId];
		const [tasks] = await db.query(sql, values);
		return tasks;
	}
	static async delete(transactionConnection, sessionId) {
		const sql = `DELETE FROM tasks WHERE session_id = ?`;
		const values = [sessionId];
		const [result] = await transactionConnection.query(sql, values);

		return result;
	}
	static async deleteImages(transactionConnection, sessionId) {
		const sql = `DELETE FROM task_images WHERE 
		task_id = (SELECT id FROM tasks WHERE session_id = ?)`;
		const values = [sessionId];
		const [images] = await transactionConnection.query(sql, values);
		return images;
	}
	static async checkTaskForSession(sessionId) {
		const sql = `SELECT COUNT(id) as count FROM tasks WHERE session_id = ?`;
		const values = [sessionId];
		const [result] = await db.query(sql, values);
		return result;
	}

	static async saveImages(transactionConnection, taskId, images) {
		const sql = `INSERT INTO task_images(task_id, image) VALUES ?`;
		const values = [images.map((img) => [taskId, img])];
		const [result] = await transactionConnection.query(sql, values);
		return result;
	}
	static async getImages(taskId) {
		const sql = `SELECT image FROM task_images WHERE task_id = ?`;
		const values = [taskId];
		const [images] = await db.query(sql, values);
		return images;
	}
}

module.exports = TasksModel;
