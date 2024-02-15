const SessionsModel = require("../models/SessionsModel");
const AppError = require("../utils/appError");

class SessionsServices {
	static async add(session) {
		await SessionsModel.add(session);
	}
	static async getOfClass(classId) {
		const sessions = await SessionsModel.getOfClass(classId);

		return sessions;
	}

	static async delete(id) {
		const result = await SessionsModel.delete(id);

		if (result.affectedRows == 0) {
			throw new AppError("Session not found", 404);
		}
	}
	static checkExists = async (id) => {
		const result = await SessionsModel.checkExists(id);
		return result[0].count > 0;
	};
}

module.exports = SessionsServices;
