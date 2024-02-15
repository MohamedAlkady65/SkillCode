const CoursesServices = require("../services/CoursesServices");
const catchAsync = require("../utils/catchAsync");
const couserValidation = require("../validations/courseValidation");

exports.addCourse = catchAsync(async (req, res, next) => {
	const validatedData = await couserValidation.validate(req.body);
	await CoursesServices.addCourse(validatedData);

	res.status(201).json({
		status: "success",
		message: "Course Added Successfully",
	});
});
exports.editCourseById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const course = await couserValidation.validate(req.body, true);

	if (Object.keys(course).length !== 0) {
		await CoursesServices.editCourseById(course, id);
	}

	res.status(200).json({
		status: "success",
		message: "Course Edited Successfully",
	});
});

exports.getAllCourses = catchAsync(async (req, res, next) => {
	const result = await CoursesServices.getAllCourses(req.query);
	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.courses.length,
		data: result.courses,
	});
});
exports.getCourseById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const course = await CoursesServices.getCourseById(id);
	res.status(200).json({
		status: "success",
		data: course,
	});
});

exports.deleteCourseById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await CoursesServices.deleteCourseById(id);

	res.status(204).json({
		status: "success",
		data: null,
	});
});
