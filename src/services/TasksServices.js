const db = require("../config/db.js");
const TasksModel = require("../models/TasksModel");
const AppError = require("../utils/appError");
const sharpHandler = require("../utils/sharpHandler");

class TasksServices {
	static async add(task, images) {
		const hasTask = await this.checkTaskForSession(task.sessionId);
		if (hasTask) {
			throw new AppError("Session has already task", 400);
		}
		const transactionConnection = await db.transactionConnection();

		await transactionConnection.run(async () => {
			const result = await TasksModel.add(transactionConnection, task);
			const taskId = result.insertId;
			if (!images || images.length == 0) return;
			const imagesNames = await saveImages(images, taskId);
			await TasksModel.saveImages(
				transactionConnection,
				taskId,
				imagesNames
			);
		});
	}
	static async getOfSession(sessionId) {
		const tasks = await TasksModel.getOfSession(sessionId);
		if (tasks.length < 1) {
			throw new AppError("No task for this session", 404);
		}
		const task = tasks[0];

		const images = await TasksModel.getImages(task.id);

		task.images = images.map((img) => img.image);

		return task;
	}
	static async delete(sessionId) {
		const transactionConnection = await db.transactionConnection();

		await transactionConnection.run(async () => {
			await TasksModel.deleteImages(transactionConnection, sessionId);
			const result = await TasksModel.delete(
				transactionConnection,
				sessionId
			);
			if (result.affectedRows == 0) {
				throw new AppError("Task not found", 404);
			}
		});
	}

	static async checkTaskForSession(sessionId) {
		const result = await TasksModel.checkTaskForSession(sessionId);
		return result[0].count > 0;
	}
}

const saveImages = async (images, taskId) => {
	const promises = images.map(async (img) => {
		const random = Math.floor(Math.random() * 1000 * Date.now());
		const name = `task-${taskId ?? ""}-${random}.jpeg`;

		await sharpHandler({
			file: img,
			path: `public/images/tasks/${name}`,
			resize: false,
		});
		return name;
	});

	const imagesNames = await Promise.all(promises);

	return imagesNames;
};
module.exports = TasksServices;
