const db = require("../db.js");

class ReportsModel {
	static async add({ transactionConnection, report }) {
		const sql = `INSERT INTO reports  (class_id,student_id,summary) VALUES (?,?,?)`;
		const values = [report.classId, report.studentId, report.summary];
		const [result] = await transactionConnection.query(sql, values);
		return result;
	}
	static async addAttributes({
		transactionConnection,
		reportId,
		attributes,
	}) {
		const sql = `INSERT INTO report_attributes (report_id, attribute_id, value) VALUES ?`;
		const values = [
			Object.keys(attributes).map((id) => [
				reportId,
				+id,
				attributes[id],
			]),
		];
		await transactionConnection.query(sql, values);
	}
}

module.exports = ReportsModel;
