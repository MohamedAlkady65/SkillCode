const fs = require("fs");
const multer = require("multer");

const catchAsync = require("../utils/catchAsync.js");
const StudentsServices = require("../services/StudentsServices.js");
const studentValidation = require("../validations/studentValidation.js");
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
		const name = `student-${Math.floor(
			Math.random() * 1000 * Date.now()
		)}.jpeg`;

		await sharpHandler({
			file: file,
			path: `public/images/students/${name}`,
		});
		return name;
	}
};

exports.addStudent = catchAsync(async (req, res, next) => {
	if (!req.user.isAdmin) {
		req.body.school = req.user.school_id;
	}

	const studentData = await studentValidation.validate(req.body);

	studentData.photo = await savePhoto(req.file);

	try {
		await StudentsServices.addStudent(studentData);
	} catch (error) {
		if (studentData.photo) {
			fs.unlink(`public/images/students/${studentData.photo}`, (_) => {
				console.log(_);
			});
		}
		throw error;
	}

	res.status(201).json({
		status: "success",
		message: "Student has been added successfully",
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

const getAllStudents = async (req, res, next) => {
	const result = await StudentsServices.getAllStudents(req.query);

	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.students.length,
		data: result.students,
	});
};

exports.getStudent = catchAsync(async (req, res, next) => {
	switch (req.user.role) {
		case 1:
			await getAllStudents(req, res, next);
			break;
		case 2:
			req.query.school = req.user.school_id;
			await getAllStudents(req, res, next);
			break;
		default:
			break;
	}
});

exports.getStudentByNationalId = catchAsync(async (req, res, next) => {
	const id = req.params.national_id;
	const student = await StudentsServices.getStudentByNationalId(id);

	res.status(200).json({
		status: "success",
		data: student,
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
	const photo = await savePhoto(req.file);

	if (photo) {
		student.photo = photo;
	}

	try {
		if (Object.keys(student).length !== 0) {
			await StudentsServices.editStudentById(student, id);
		}
	} catch (error) {
		if (student.photo) {
			fs.unlink(`public/images/students/${student.photo}`, (_) => {});
		}
		throw error;
	}

	res.status(200).json({
		status: "success",
		message: "Student Edited Successfully",
	});
});
