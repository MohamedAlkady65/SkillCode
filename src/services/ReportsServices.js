const db = require("../config/db.js");
const ReportsModel = require("../models/ReportsModel");
const AppError = require("../utils/appError");

class ReportsServices {
	static async add(report) {
		const transactionConnection = await db.transactionConnection();

		const add = async () => {
			try {
				await ReportsModel.add({
					transactionConnection: transactionConnection,
					report: report,
				});
			} catch (error) {
				if (error.code == "ER_DUP_ENTRY") {
					throw new AppError("Student already has a report");
				}
				throw error;
			}
		};

		await transactionConnection.run(async () => {
			const result = await add();
			const reportId = result.insertId;
			await ReportsModel.addAttributes({
				transactionConnection: transactionConnection,
				reportId: reportId,
				attributes: report.attributes,
			});
		});
	}
}

module.exports = ReportsServices;
