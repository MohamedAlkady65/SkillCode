const ClassesServices = require("../services/ClassesServices");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const classValidation = require("../validations/classValidation");

exports.add = catchAsync(async (req, res, next) => {
	const class_ = await classValidation.validateAndCheck(req.user, req.body);
	await ClassesServices.add(class_);

	res.status(201).json({
		status: "success",
		message: "Class Added Successfully",
	});
});

exports.getAll = catchAsync(async (req, res, next) => {
	if (req.user.isSchool) {
		req.query.school_id = req.user.school_id;
	}

	const result = await ClassesServices.getAll(req.query);

	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.classes.length,
		data: result.classes,
	});
});

exports.getById = catchAsync(async (req, res, next) => {
	const classId = req.params.id;

	const class_ = await ClassesServices.getById(classId);

	res.status(200).json({
		status: "success",
		data: class_,
	});
});
exports.editById = catchAsync(async (req, res, next) => {
	const class_id = +req.params.id;
	if (isNaN(class_id)) {
		return next(new AppError("Class not found", 404));
	}
	const class_ = await classValidation.validateAndCheck(
		req.user,
		req.body,
		true,
		class_id
	);

	if (Object.keys(class_).length !== 0) {
		await ClassesServices.editById(class_id, class_);
	}

	res.status(200).json({
		status: "success",
		message: "Class Edited Successfully",
	});
});

exports.deleteById = catchAsync(async (req, res, next) => {
	const classId = req.params.id;

	await ClassesServices.deleteById(classId);

	res.status(204).json({
		status: "success",
		data: null,
	});
});
exports.enrollStudents = catchAsync(async (req, res, next) => {
	req.body.class_id = req.params.id;

	const data = await classValidation.validateEnrollStudents(req.body);

	await ClassesServices.enrollStudents(data.class_id, data.students);

	res.status(200).json({
		status: "success",
		message: "Students Enrolled Successfully",
	});
});
exports.removeEnrolledStudents = catchAsync(async (req, res, next) => {
	req.body.class_id = req.params.id;

	const data = await classValidation.validateEnrollStudents(req.body);

	await ClassesServices.removeEnrolledStudents(data.class_id, data.students);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.getEnrolledStudents = catchAsync(async (req, res, next) => {
	const classId = req.params.id;
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

exports.checkClassInSchool = catchAsync(async (req, res, next) => {
	if (req.user.isSchool) {
		await ClassesServices.checkClassInSchool({
			classId: req.params.id,
			schoolId: req.user.school_id,
		});
	}
	next();
});
