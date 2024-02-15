const StudentsModel = require("../models/StudentsModel");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/appError");

class StudentsServices {
	constructor() {}

	static addStudent = async (student) => {
		await StudentsModel.addStudent(student);
	};

	static getAllStudents = async (query) => {
		const features = new ApiFeatures(query);

		const queryString = features
			.filter(["school"])
			.sort(["id", "name"])
			.search(["name"])
			.pagination()
			.query();

		const students = await StudentsModel.getAllStudents(queryString);

		if (!features.page) return { students };

		const result = await StudentsModel.getNumberOfStudents();
		const pagesCount = Math.ceil(result[0].count / features.limit);

		return { pagesCount, students };
	};
	static getStudentById = async (id) => {
		const students = await StudentsModel.getStudentById(id);
		if (students.length == 0) {
			throw new AppError("Student not found", 404);
		}
		return students[0];
	};
	static getStudentByNationalId = async (id) => {
		const students = await StudentsModel.getStudentByNationalId(id);
		if (students.length == 0) {
			throw new AppError("Student not found", 404);
		}
		return students[0];
	};
	static deleteStudentById = async (id) => {
		const result = await StudentsModel.deleteStudentById(id);

		if (result.affectedRows == 0) {
			throw new AppError("Student not found", 404);
		}
	};

	static async checkStudentInSchool({ studentId, schoolId }) {
		const result = await StudentsModel.checkStudentInSchool(studentId);

		if (result.length == 0) {
			throw new AppError("Student not found", 404);
		}

		if (result[0].school != schoolId) {
			throw new AppError("Forbidden, You have not permission", 403);
		}
	}

	static checkNationalIdExists = async (national_id) => {
		const result = await StudentsModel.checkNationalIdExists(national_id);

		return result[0].national_id > 0;
	};

	static editStudentById = async (student, id) => {
		const result = await StudentsModel.editStudentById(student, id);
		if (result.affectedRows == 0) {
			throw new AppError("Student not found", 404);
		}
	};
	static checkExists = async (id) => {
		const result = await StudentsModel.checkExists(id);
		return result[0].count > 0;
	};
}

module.exports = StudentsServices;
