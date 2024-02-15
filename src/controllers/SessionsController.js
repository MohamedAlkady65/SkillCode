const SessionsServices = require("../services/SessionsServices");
const catchAsync = require("../utils/catchAsync");
const checkIdValid = require("../validations/checkIdValid");
const sessionValidation = require("../validations/sessionValidation");

exports.add = catchAsync(async (req, res, next) => {
	req.body.classId = req.params.classId;

	const session = await sessionValidation.validate(req.body);

	await SessionsServices.add(session);

	res.status(201).json({
		status: "success",
		message: "Session Add Successfully",
	});
});

exports.delete = catchAsync(async (req, res, next) => {
	const id = checkIdValid(req.params.id, "Session not found");

	await SessionsServices.delete(id);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.getOfClass = catchAsync(async (req, res, next) => {
	const id = checkIdValid(req.params.classId, "Class not found");

	const sessions = await SessionsServices.getOfClass(id);

	res.status(200).json({
		status: "success",
		data: sessions,
	});
});
