const db = require("../db");
const TeachersModel = require("../models/TeachersModel");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/appError");
const UsersServices = require("./UsersServices");

class TeachersServices {
	constructor() {}

	static addTeacher = async (teacher) => {
		const transactionConnection = await db.transactionConnection();

		const teacherId = await transactionConnection.run(async () => {
			await UsersServices.addUser(transactionConnection, {
				email: teacher.email,
				password: teacher.email,
				role: 3,
			});

			const teacherId = await TeachersModel.addTeacher({
				teacher: teacher,
				transactionConnection: transactionConnection,
			});

			return teacherId;
		});
	};

	static getAllTeachers = async (query) => {
		const features = new ApiFeatures(query);

		const queryString = features
			.filter(["school"])
			.sort(["id", "name"])
			.search(["name"])
			.pagination()

			.query();

		const teachers = await TeachersModel.getAllTeachers(queryString);

		teachers.forEach((teacher) => {
			if (teacher.school_id == null) {
				teacher.school = null;
			} else {
				teacher.school = {
					id: teacher.school_id,
					name: teacher.school_name,
				};
			}

			delete teacher.school_id;
			delete teacher.school_name;
		});

		if (!features.page) return { teachers };

		const result = await TeachersModel.getNumberOfTeachers();
		const pagesCount = Math.ceil(result[0].count / features.limit);

		return { pagesCount, teachers };
	};
	static getTeacherById = async (id) => {
		const teachers = await TeachersModel.getTeacherById(id);
		if (teachers.length == 0) {
			throw new AppError("Teacher not found", 404);
		}
		const teacher = teachers[0];

		if (teacher.school_id == null) {
			teacher.school = null;
		} else {
			teacher.school = {
				id: teacher.school_id,
				name: teacher.school_name,
			};
		}

		delete teacher.school_id;
		delete teacher.school_name;

		return teacher;
	};
	static deleteTeacherById = async (id) => {
		const result = await TeachersModel.deleteTeacherById(id);

		if (result.affectedRows == 0) {
			throw new AppError("Teacher not found", 404);
		}
	};

	static async checkTeacherInSchool({ teacherId, schoolId }) {
		const result = await TeachersModel.getSchoolOfTeacher(teacherId);

		if (result.length == 0) {
			throw new AppError("Teacher not found", 404);
		}

		if (result[0].school != schoolId) {
			throw new AppError("Forbidden, You have not permission", 403);
		}
	}

	static checkNationalIdExists = async (national_id) => {
		const result = await TeachersModel.checkNationalIdExists(national_id);

		return result[0].national_id > 0;
	};

	static editTeacherById = async (teacher, id) => {
		const result = await TeachersModel.editTeacherById(teacher, id);
		if (result.affectedRows == 0) {
			throw new AppError("Teacher not found", 404);
		}
	};

	static checkExists = async (id) => {
		const result = await TeachersModel.checkExists(id);
		return result[0].count > 0;
	};
}

module.exports = TeachersServices;
