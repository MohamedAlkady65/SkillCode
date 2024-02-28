const db = require("../db");
const CoursesModel = require("../models/CoursesModel");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/appError");

class CoursesServices {
	static async getAllCourses(query) {
		const features = new ApiFeatures(query);
		const [queryString, queryStringForCount] = features
			.pagination()
			.query();
		const courses = await CoursesModel.getAllCourses(queryString);
		if (!features.page) return { courses };

		const result = await CoursesModel.getNumberOfCourses(
			queryStringForCount
		);
		const pagesCount = Math.ceil(result[0].count / features.limit);

		return { pagesCount, courses };
	}
	static getListOfCourses = async () => {
		const courses = await CoursesModel.getListOfCourses();
		return courses;
	};
	static async getCourseById(id) {
		const courses = await CoursesModel.getCourseById(id);
		if (courses.length == 0) {
			throw new AppError("Course not found", 404);
		}
		const course = courses[0];
		const attributes = await CoursesModel.getCourseAttributeById(id);
		course.attributes = attributes;
		return course;
	}

	static async addCourse(course) {
		const transactionConnection = await db.transactionConnection();
		await transactionConnection.run(async () => {
			const result = await CoursesModel.addCourse({
				transactionConnection,
				course,
			});
			const courseId = result.insertId;
			await CoursesModel.addCourseReportAttribute({
				transactionConnection,
				courseId: courseId,
				attributes: course.attributes,
			});
		});
	}

	static async editCourseById(course, id) {
		const result = await CoursesModel.editCourseById(course, id);
		if (result.affectedRows == 0) {
			throw new AppError("Course not found", 404);
		}
	}
	static async deleteCourseById(id) {
		const result = await CoursesModel.deleteCourseById(id);
		if (result.affectedRows == 0) {
			throw new AppError("Course not found", 404);
		}
	}
	static checkExists = async (id) => {
		const result = await CoursesModel.checkExists(id);
		return result[0].count > 0;
	};
	static async getCourseAttributeByClassId(classId) {
		const attributes = await CoursesModel.getCourseAttributeByClassId(
			classId
		);

		return attributes;
	}
}

module.exports = CoursesServices;
