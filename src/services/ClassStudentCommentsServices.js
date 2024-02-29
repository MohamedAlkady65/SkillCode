const ClassStudentCommentsModel = require("../models/ClassStudentCommentsModel");
const AppError = require("../utils/appError");
class ClassStudentCommentsServices {
	static async get({ classId, studentId }) {
		const comments = await ClassStudentCommentsModel.get({
			classId,
			studentId,
		});

		return comments;
	}
	static async add(comment) {
		await ClassStudentCommentsModel.add(comment);
	}
	static async delete(id) {
		const result = await ClassStudentCommentsModel.delete(id);

		if (result.length == 0) {
			throw new AppError("Comment not found", 404);
		}
	}
	static async checkStudentAndClassAndEnrollmentExists({
		classId,
		studentId,
	}) {
		const result =
			await ClassStudentCommentsModel.checkStudentAndClassAndEnrollmentExists(
				{ classId, studentId }
			);

		const [studentsCount, classesCount, enrollmentsCount] = [
			result[0].count,
			result[1].count,
			result[2].count,
		];

		if (studentsCount < 1) {
			throw new AppError("Studnet not found", 404);
		} else if (classesCount < 1) {
			throw new AppError("Class not found", 404);
		} else if (enrollmentsCount < 1) {
			throw new AppError("Student is not enrolled in this class", 400);
		}
	}
	static async authorizeComment({ commentId, teacherId, schoolId }) {
		const result = await ClassStudentCommentsModel.getSchoolAndTeacher(
			commentId
		);
		if (result.length == 0) {
			throw new AppError("Comment not found", 404);
		}

		if (teacherId && result[0].teacher_id != teacherId) {
			throw new AppError("Forbidden, You have not permission", 403);
		}

		if (schoolId && result[0].school_id != schoolId) {
			throw new AppError("Forbidden, You have not permission", 403);
		}
	}
}

module.exports = ClassStudentCommentsServices;
