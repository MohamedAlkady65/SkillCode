const TasksServices = require("../services/TasksServices");
const catchAsync = require("../utils/catchAsync");
const checkIdValid = require("../validations/checkIdValid");
const taskValidation = require("../validations/taskValidation");
const uploadMulter = require("../utils/uploadMulter.js");
const AppError = require("../utils/appError.js");

const upload = uploadMulter({
	typeError: new AppError("Images must be only image type", 400),
});

exports.uploadImages = upload.array("images", 5);

exports.add = catchAsync(async (req, res, next) => {
	req.body.sessionId = req.params.sessionId;

	const task = await taskValidation.validate(req.body);

	await TasksServices.add(task, req.files);

	res.status(201).json({
		status: "success",
		message: "Task Add Successfully",
	});
});

exports.delete = catchAsync(async (req, res, next) => {
	const sessionId = checkIdValid(req.params.sessionId, "Session not found");

	await TasksServices.delete(sessionId);

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.getOfSession = catchAsync(async (req, res, next) => {
	const sessionId = checkIdValid(req.params.sessionId, "Session not found");

	const task = await TasksServices.getOfSession(sessionId);

	res.status(200).json({
		status: "success",
		data: task,
	});
});
