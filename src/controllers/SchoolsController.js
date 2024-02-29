const catchAsync = require("../utils/catchAsync.js");
const SchoolsServices = require("../services/SchoolsServices.js");
const schoolValidation = require("../validations/schoolValidation.js");
const AppError = require("../utils/appError.js");
const uploadMulter = require("../utils/uploadMulter.js");
const SchoolsModel = require("../models/SchoolsModel.js");

exports.uploadLogo = uploadMulter({
	typeError: new AppError("Logo must be an image", 400),
}).single("logo");

exports.add = catchAsync(async (req, res, next) => {
	const school = await schoolValidation.validate(req.body);
	await SchoolsServices.addSchool(school, req.file);
	res.status(201).json({
		status: "success",
		message: "School has been added successfully",
	});
});

exports.getAll = catchAsync(async (req, res, next) => {
	const result = await SchoolsServices.getAllSchools(req.query);
	res.status(200).json({
		status: "success",
		pagesCount: result.pagesCount,
		results: result.schools.length,
		data: result.schools,
	});
});

exports.getList = catchAsync(async (req, res, next) => {
	const schools = await SchoolsModel.getListOfSchools();
	res.status(200).json({
		status: "success",
		data: schools,
	});
});

exports.getMe = catchAsync(async (req, res, next) => {
	const id = req.user.school_id;
	await getById(req, res, id);
});

exports.getById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await getById(req, res, id);
});

exports.deleteSchoolById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await SchoolsServices.deleteSchoolById(id);
	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.editById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	await editById(req, res, id);
});

exports.editMe = catchAsync(async (req, res, next) => {
	const id = req.user.school_id;
	await editById(req, res, id);
});

const editById = async (req, res, id) => {
	const school = await schoolValidation.validate(req.body, true);
	if (Object.keys(school).length !== 0 || req.file) {
		await SchoolsServices.editSchoolById(school, id, req.file);
	}

	res.status(200).json({
		status: "success",
		message: "School Edited Successfully",
	});
};
const getById = async (req, res, id) => {
	const school = await SchoolsServices.getSchoolById(id);
	res.status(200).json({
		status: "success",
		data: school,
	});
};
