const fs = require("fs");
const multer = require("multer");

const catchAsync = require("../utils/catchAsync.js");
const TeachersServices = require("../services/TeachersServices.js");
const teacherValidation = require("../validations/teacherValidation.js");
const sharpHandler = require("../utils/sharpHandler.js");
const AppError = require("../utils/appError.js");

const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb(new AppError("Photo must be an image", 400), false);
		}
	},
	limits: {
		fileSize: 10 ** 6,
	},
});

exports.uploadPhoto = upload.single("photo");

const savePhoto = async (file) => {
	if (file) {
		const name = `teacher-${Math.floor(
			Math.random() * 1000 * Date.now()
		)}.jpeg`;

		await sharpHandler({
			file: file,
			path: `public/images/teachers/${name}`,
		});
		return name;
	}
};

exports.addTeacher = catchAsync(async (req, res, next) => {
	if (!req.user.isAdmin) {
		delete req.body.school;
	}

	const teacherData = await teacherValidation.validate(req.body);

	if (req.user.isSchool) {
		teacherData.school = req.user.school_id;
	}

	teacherData.photo = await savePhoto(req.file);

	try {
		await TeachersServices.addTeacher(teacherData);
	} catch (error) {
		if (teacherData.photo) {
			fs.unlink(`public/images/teachers/${teacherData.photo}`, (_) => {
				console.log(_);
			});
		}
		throw error;
	}

	res.status(201).json({
		status: "success",
		message: "Teacher has been added successfully",
	});
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

const getTeacherById = async (req, res, next) => {
	const id = req.params.id;
	const teacher = await TeachersServices.getTeacherById(id);

	res.status(200).json({
		status: "success",
		data: teacher,
	});
};

const getAllTeachers = async (req, res, next) => {
	const result = await TeachersServices.getAllTeachers(req.query);

	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.teachers.length,
		data: result.teachers,
	});
};

exports.getTeacher = catchAsync(async (req, res, next) => {
	switch (req.user.role) {
		case 1:
			await getAllTeachers(req, res, next);
			break;
		case 2:
			req.query.school = req.user.school_id;
			await getAllTeachers(req, res, next);
			break;
		case 3:
			req.params.id = req.user.teacher_id;
			await getTeacherById(req, res, next);
			break;
		default:
			break;
	}
});

exports.getTeacherById = catchAsync(getTeacherById);

exports.deleteTeacherById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await TeachersServices.deleteTeacherById(id);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.editTeacherById = catchAsync(async (req, res, next) => {
	const id = getTeacherId();
	if (!req.user.isAdmin) {
		delete teacher.school;
	}
	const teacher = await teacherValidation.validate(req.body, true);
	const photo = await savePhoto(req.file);

	if (photo) {
		teacher.photo = photo;
	}

	try {
		if (Object.keys(teacher).length !== 0) {
			await TeachersServices.editTeacherById(teacher, id);
		}
	} catch (error) {
		if (teacher.photo) {
			fs.unlink(`public/images/teachers/${teacher.photo}`, (_) => {});
		}
		throw error;
	}

	res.status(200).json({
		status: "success",
		message: "Teacher Edited Successfully",
	});

	function getTeacherId() {
		let id;
		if (req.user.isAdmin || req.user.isSchool) {
			id = req.params.id;
			if (!id) throw new AppError("Please Provide Teacher Id", 400);
			if (!+id) throw new AppError("Teacher not found", 404);
		} else if (req.user.isTeacher) {
			id = req.user.teacher_id;
		}
		return id;
	}
});
