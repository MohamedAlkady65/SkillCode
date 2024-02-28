const StudentsModel = require("../models/StudentsModel");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/appError");
const sharpHandler = require("../utils/sharpHandler.js");
const db = require("../db.js");

class StudentsServices {
	constructor() {}

	static addStudent = async (student, photo) => {
		const transactionConnection = await db.transactionConnection();

		await transactionConnection.run(async () => {
			student.photo = await savePhoto(photo);
			await StudentsModel.addStudent(transactionConnection, student);
		});
	};

	static getAllStudents = async (query) => {
		const features = new ApiFeatures(query, { name: "s" });

		const [queryString, queryStringForCount] = features
			.filter(["school"])
			.sort(["id", "name"])
			.search(["name"])
			.pagination()
			.query();

		const students = await StudentsModel.getAllStudents(queryString);

		students.forEach(handleStudent);

		if (!features.page) return { students };

		const result = await StudentsModel.getNumberOfStudents(
			queryStringForCount
		);
		const pagesCount = Math.ceil(result[0].count / features.limit);

		return { pagesCount, students };
	};
	static getStudentById = async (id) => {
		const students = await StudentsModel.getStudentById(id);
		if (students.length == 0) {
			throw new AppError("Student not found", 404);
		}

		const student = students[0];
		handleStudent(student);
		return student;
	};
	static getStudentByNationalId = async (id) => {
		const students = await StudentsModel.getStudentByNationalId(id);
		if (students.length == 0) {
			throw new AppError("Student not found", 404);
		}
		const student = students[0];
		handleStudent(student);
		return student;
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

	static editStudentById = async (student, id, photo) => {
		const transactionConnection = await db.transactionConnection();

		const result = await transactionConnection.run(async () => {
			student.photo = await savePhoto(photo);
			const result = await StudentsModel.editStudentById(
				transactionConnection,
				student,
				id
			);
			return result;
		});
		if (result.affectedRows == 0) {
			throw new AppError("Student not found", 404);
		}
	};
	static checkExists = async (id) => {
		const result = await StudentsModel.checkExists(id);
		return result[0].count > 0;
	};
}

const handleStudent = (student) => {
	if (student.school_id == null) {
		student.school = null;
	} else {
		student.school = {
			id: student.school_id,
			name: student.school_name,
		};
	}

	delete student.school_id;
	delete student.school_name;
};

const savePhoto = async (file) => {
	if (file) {
		const random = Math.floor(Math.random() * 1000 * Date.now());
		const name = `student-${random}.jpeg`;

		await sharpHandler({
			file: file,
			path: `public/images/students/${name}`,
		});
		return name;
	}
};
module.exports = StudentsServices;
