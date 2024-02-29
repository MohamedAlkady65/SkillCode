const ClassesServices = require("../services/ClassesServices");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const classValidation = require("../validations/classValidation");

exports.enrollStudents = catchAsync(async (req, res, next) => {
	req.body.class_id = req.params.classId;

	const data = await classValidation.validateEnrollStudents(req.body);

	await ClassesServices.enrollStudents(data.class_id, data.students);

	res.status(200).json({
		status: "success",
		message: "Students Enrolled Successfully",
	});
});
exports.removeEnrolledStudents = catchAsync(async (req, res, next) => {
	req.body.class_id = req.params.classId;

	const data = await classValidation.validateEnrollStudents(req.body);

	await ClassesServices.removeEnrolledStudents(data.class_id, data.students);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.getEnrolledStudents = catchAsync(async (req, res, next) => {
	const classId = req.params.classId;
	const result = await ClassesServices.getEnrolledStudents(
		classId,
		req.query
	);

	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.students.length,
		data: result.students,
	});
});
