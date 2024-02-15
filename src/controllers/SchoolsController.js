const fs = require("fs");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync.js");
const SchoolsServices = require("../services/SchoolsServices.js");
const schoolValidation = require("../validations/schoolValidation.js");
const AppError = require("../utils/appError.js");
const sharpHandler = require("../utils/sharpHandler.js");

const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb(new AppError("Logo must be an image", 400), false);
		}
	},
	limits: {
		fileSize: 10 ** 6,
	},
});

exports.uploadLogo = upload.single("logo");

const saveLogo = async (file) => {
	if (file) {
		const name = `school-${Math.floor(
			Math.random() * 1000 * Date.now()
		)}.jpeg`;

		await sharpHandler({
			file: file,
			path: `public/images/schools/${name}`,
		});
		return name;
	}
};

exports.addSchool = catchAsync(async (req, res, next) => {
	const school = await schoolValidation.validate(req.body);

	school.logo = await saveLogo(req.file);

	try {
		await SchoolsServices.addSchool(school);
	} catch (error) {
		if (school.logo) {
			fs.unlink(`public/images/schools/${school.logo}`, (_) => {});
		}
		throw error;
	}

	res.status(201).json({
		status: "success",
		message: "School has been added successfully",
	});
});

const getAllSchools = async (req, res, next) => {
	const result = await SchoolsServices.getAllSchools(req.query);
	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.schools.length,
		data: result.schools,
	});
};

const getSchoolById = async (req, res, next) => {
	const id = req.params.id;
	const school = await SchoolsServices.getSchoolById(id);

	res.status(200).json({
		status: "success",
		data: school,
	});
};
exports.getSchoolById = catchAsync(getSchoolById);

exports.getSchool = catchAsync(async (req, res, next) => {
	switch (req.user.role) {
		case 1:
			await getAllSchools(req, res, next);
			break;

		case 2:
			req.params.id = req.user.school_id;
			await getSchoolById(req, res, next);
			break;

		default:
			break;
	}
});

exports.deleteSchoolById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await SchoolsServices.deleteSchoolById(id);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.editSchoolById = catchAsync(async (req, res, next) => {
	const id = getSchoolId();
	const school = await schoolValidation.validate(req.body, true);
	const logo = await saveLogo(req.file);

	if (logo) {
		school.logo = logo;
	}

	try {
		if (Object.keys(school).length !== 0) {
			await SchoolsServices.editSchoolById(school, id);
		}
	} catch (error) {
		if (school.logo) {
			fs.unlink(`public/images/schools/${school.logo}`, (_) => {});
		}
		throw error;
	}

	res.status(200).json({
		status: "success",
		message: "School Edited Successfully",
	});

	function getSchoolId() {
		let id;
		if (req.user.isAdmin) {
			id = req.params.id;
			if (!id) throw new AppError("Please Provide School Id", 400);
			if (!+id) throw new AppError("School not found", 404);
		} else if (req.user.isSchool) {
			id = req.user.school_id;
		}
		return id;
	}
});
