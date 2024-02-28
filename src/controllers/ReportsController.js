const ReportsServices = require("../services/ReportsServices");
const catchAsync = require("../utils/catchAsync");
const reportValidation = require("../validations/reportValidation");

exports.add = catchAsync(async (req, res, next) => {
	req.body.classId = req.params.classId;
	req.body.studentId = req.params.studentId;
	const report = await reportValidation.validate(req.body);

	await ReportsServices.add(report);

	res.status(201).json({
		status: "success",
		message: "Report Added Successfully",
	});
});
