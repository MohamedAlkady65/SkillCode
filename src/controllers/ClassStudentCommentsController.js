const ClassStudentCommentsServices = require("../services/ClassStudentCommentsServices");
const catchAsync = require("../utils/catchAsync");
const classStudentCommentsValidate = require("../validations/classStudentCommentsValidate");

exports.get = catchAsync(async (req, res, next) => {
	const { classId, studentId } = req.params;

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
