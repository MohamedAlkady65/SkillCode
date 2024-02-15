const TasksModel = require("../models/TasksModel");
const AppError = require("../utils/appError");

class TasksServices {
	static async add(task) {
		const hasTask = await this.checkTaskForSession(task.sessionId);
		if (hasTask) {
			throw new AppError("Session has already task", 400);
		}
		await TasksModel.add(task);
	}
	static async getOfSession(sessionId) {
		const tasks = await TasksModel.getOfSession(sessionId);
		if (tasks.length < 1) {
			throw new AppError("No task for this session", 404);
		}
		return tasks[0];
	}
	static async delete(sessionId) {
		const result = await TasksModel.delete(sessionId);

		if (result.affectedRows == 0) {
			throw new AppError("Task not found", 404);
		}
	}
	static async checkTaskForSession(sessionId) {
		const result = await TasksModel.checkTaskForSession(sessionId);
		return result[0].count > 0;
	}
}

module.exports = TasksServices;
