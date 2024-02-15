const ClassesModel = require("../models/ClassesModel");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/appError");

const handleClass = (class_) => {
	class_.school = {
		id: class_.school_id,
		name: class_.school_name,
	};
	delete class_.school_id;
	delete class_.school_name;

	class_.course = {
		id: class_.course_id,
		name: class_.course_title,
	};
	delete class_.course_id;
	delete class_.course_title;

	class_.teacher = {
		id: class_.teacher_id,
		name: class_.teacher_name,
	};
	delete class_.teacher_id;
	delete class_.teacher_name;
};

class ClassesServices {
	static async getAll(query) {
		const features = new ApiFeatures(query);
		const queryString = features.filter(["school_id"]).pagination().query();
		const classes = await ClassesModel.getAll(queryString);
		classes.forEach(handleClass);

		if (!features.page) return { classes };

		const result = await ClassesModel.getNumber();
		const pagesCount = Math.ceil(result[0].count / features.limit);

		return { pagesCount, classes };
	}
	static async getById(id) {
		const classes = await ClassesModel.getById(id);
		if (classes.length == 0) {
			throw new AppError("Class not found", 404);
		}
		const class_ = classes[0];
		handleClass(class_);

		return class_;
	}

	static async add(class_) {
		await ClassesModel.add(class_);
	}
	static async editById(class_id, class_) {
		const result = await ClassesModel.editById(class_id, class_);
		if (result.affectedRows == 0) {
			throw new AppError("Class not found", 404);
		}
	}
	static async deleteById(class_) {
		const result = await ClassesModel.deleteById(class_);
		if (result.affectedRows == 0) {
			throw new AppError("Class not found", 404);
		}
	}
	static async enrollStudents(classId, students) {
		await ClassesModel.enrollStudents(classId, students);
	}

	static async removeEnrolledStudents(classId, students) {
		await ClassesModel.removeEnrolledStudents(classId, students);
	}

	static async getEnrolledStudents(classId, query) {
		const features = new ApiFeatures(query);
		const queryString = features.pagination().query();

		const students = await ClassesModel.getEnrolledStudents(
			classId,
			queryString
		);

		if (!features.page) return { students };

		const result = await ClassesModel.getEnrolledStudentsNumber();
		const pagesCount = Math.ceil(result[0].count / features.limit);

		return { pagesCount, students };
	}
	static checkExists = async (id) => {
		const result = await ClassesModel.checkExists(id);
		return result[0].count > 0;
	};
	static getSchoolOfClass = async (classId) => {
		const result = await ClassesModel.getSchoolOfClass(classId);

		if (result.length == 0) {
			throw new AppError("Class not found", 404);
		}

		return result[0].school_id;
	};
	static checkClassInSchool = async ({ schoolId, classId }) => {
		const result = await ClassesModel.getSchoolOfClass(classId);

		if (result.length == 0) {
			throw new AppError("Class not found", 404);
		}

		if (result[0].school_id != schoolId) {
			throw new AppError("Forbidden, You have not permission", 403);
		}
	};
}

module.exports = ClassesServices;
