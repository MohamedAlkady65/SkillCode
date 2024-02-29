const catchAsync = require("../utils/catchAsync.js");
const StudentsServices = require("../services/StudentsServices.js");
const studentValidation = require("../validations/studentValidation.js");
const AppError = require("../utils/appError.js");
const uploadMulter = require("../utils/uploadMulter.js");

exports.uploadPhoto = uploadMulter({
	typeError: new AppError("Photo must be an image", 400),
}).single("photo");

exports.addStudent = catchAsync(async (req, res, next) => {
	if (req.user.isSchool) {
		req.body.school = req.user.school_id;
	}

	const studentData = await studentValidation.validate(req.body);

	await StudentsServices.addStudent(studentData, req.file);

	res.status(201).json({
		status: "success",
		message: "Student has been added successfully",
	});
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
	if (req.user.isSchool) {
		req.query.school = req.user.school_id;
	}

	const result = await StudentsServices.getAllStudents(req.query);

	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.students.length,
		data: result.students,
	});
});

exports.getStudentById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const student = await StudentsServices.getStudentById(id);

	res.status(200).json({
		status: "success",
		data: student,
	});
});

exports.deleteStudentById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await StudentsServices.deleteStudentById(id);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.editStudentById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	if (!req.user.isAdmin) {
		delete req.body.school;
	}
	const student = await studentValidation.validate(req.body, true);
	if (Object.keys(student).length !== 0 || req.file) {
		await StudentsServices.editStudentById(student, id, req.file);
	}

	res.status(200).json({
		status: "success",
		message: "Student Edited Successfully",
	});
});

exports.getStudentByNationalId = catchAsync(async (req, res, next) => {
	const id = req.params.national_id;
	const student = await StudentsServices.getStudentByNationalId(id);

	res.status(200).json({
		status: "success",
		data: student,
	});
});

exports.checkStudentInSchool = catchAsync(async (req, res, next) => {
	if (req.user.isSchool) {
		await StudentsServices.checkStudentInSchool({
			studentId: req.params.id,
			schoolId: req.user.school_id,
		});
	}
	next();
});
