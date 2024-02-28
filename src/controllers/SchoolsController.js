const catchAsync = require("../utils/catchAsync.js");
const SchoolsServices = require("../services/SchoolsServices.js");
const schoolValidation = require("../validations/schoolValidation.js");
const AppError = require("../utils/appError.js");
const uploadMulter = require("../utils/uploadMulter.js");
const SchoolsModel = require("../models/SchoolsModel.js");

const upload = uploadMulter({
	typeError: new AppError("Logo must be an image", 400),
});

exports.uploadLogo = upload.single("logo");

exports.addSchool = catchAsync(async (req, res, next) => {
	const school = await schoolValidation.validate(req.body);

	await SchoolsServices.addSchool(school, req.file);

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
	if (Object.keys(school).length !== 0 || req.file) {
		await SchoolsServices.editSchoolById(school, id, req.file);
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

exports.getListOfSchools = catchAsync(async (req, res, next) => {
	const schools = await SchoolsModel.getListOfSchools();
	res.status(200).json({
		status: "success",
		data: schools,
	});
});
