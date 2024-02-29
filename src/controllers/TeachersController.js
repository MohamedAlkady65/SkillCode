const catchAsync = require("../utils/catchAsync.js");
const TeachersServices = require("../services/TeachersServices.js");
const teacherValidation = require("../validations/teacherValidation.js");
const AppError = require("../utils/appError.js");
const uploadMulter = require("../utils/uploadMulter.js");

exports.uploadPhoto = uploadMulter({
	typeError: new AppError("Photo must be an image", 400),
}).single("photo");

exports.add = catchAsync(async (req, res, next) => {
	if (!req.user.isAdmin) {
		delete req.body.school;
	}
	const teacherData = await teacherValidation.validate(req.body);
	if (req.user.isSchool) {
		teacherData.school = req.user.school_id;
	}
	await TeachersServices.addTeacher(teacherData, req.file);
	res.status(201).json({
		status: "success",
		message: "Teacher has been added successfully",
	});
});

exports.getAll = catchAsync(async (req, res, next) => {
	if (req.user.isSchool) {
		req.query.school = req.user.school_id;
	}
	const result = await TeachersServices.getAllTeachers(req.query);
	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.teachers.length,
		data: result.teachers,
	});
});

exports.getById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await getById(req, res, id);
});

exports.deleteById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await TeachersServices.deleteTeacherById(id);
	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.editById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	if (!req.user.isAdmin) {
		delete req.body.school;
	}
	await editById(req, res, id);
});

exports.getListBySchoolId = catchAsync(async (req, res, next) => {
	const schooId = req.params.schooId;
	const teachers = await TeachersServices.getListOfTeachers(schooId);
	res.status(200).json({
		status: "success",
		data: teachers,
	});
});

exports.getMe = catchAsync(async (req, res, next) => {
	const id = req.user.teacher_id;
	await getById(req, res, id);
});

exports.editMe = catchAsync(async (req, res, next) => {
	const id = req.user.teacher_id;
	delete req.body.school;

	await editById(req, res, id);
});

exports.checkTeacherInSchool = catchAsync(async (req, res, next) => {
	if (req.user.isSchool) {
		await TeachersServices.checkTeacherInSchool({
			teacherId: req.params.id,
			schoolId: req.user.school_id,
		});
	}
	next();
});

const getById = async (req, res, id) => {
	const teacher = await TeachersServices.getTeacherById(id);

	res.status(200).json({
		status: "success",
		data: teacher,
	});
};

const editById = async (req, res, id) => {
	const teacher = await teacherValidation.validate(req.body, true);
	if (Object.keys(teacher).length !== 0 || req.file) {
		await TeachersServices.editTeacherById(teacher, id, req.file);
	}

	res.status(200).json({
		status: "success",
		message: "Teacher Edited Successfully",
	});
};
