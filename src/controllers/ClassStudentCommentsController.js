const ClassStudentCommentsServices = require("../services/ClassStudentCommentsServices");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const classStudentCommentsValidate = require("../validations/classStudentCommentsValidate");

exports.get = catchAsync(async (req, res, next) => {
	const { classId, studentId } = req.params;

	if (!classId || !studentId) {
		return next();
	}

	const comments = await ClassStudentCommentsServices.get({
		classId,
		studentId,
	});

	res.status(200).json({
		status: "success",
		data: comments,
	});
});
exports.add = catchAsync(async (req, res, next) => {
	const { classId, studentId } = req.params;
	if (!classId || !studentId) {
		return next();
	}
	req.body.classId = classId;
	req.body.studentId = studentId;

	const comment = await classStudentCommentsValidate.validate(req.body);

	await ClassStudentCommentsServices.add(comment);

	res.status(200).json({
		status: "success",
		message: "Comment Added Successfully",
	});
});
exports.delete = catchAsync(async (req, res, next) => {
	const id = +req.params.id;
	if (isNaN(id)) {
		return next(new AppError("Comment not found", 404));
	}

	await ClassStudentCommentsServices.delete(id);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.authorizeComment = catchAsync(async (req, res, next) => {
	const commentId = req.params.id;
	if (req.user.isAdmin) {
		await ClassStudentCommentsServices.authorizeComment({ commentId });
	} else if (req.user.isSchool) {
		await ClassStudentCommentsServices.authorizeComment({
			commentId,
			schoolId: req.user.school_id,
		});
	} else if (req.user.isTeacher) {
		await ClassStudentCommentsServices.authorizeComment({
			commentId,
			teacherId: req.user.teacher_id,
		});
	}
	next();
});
