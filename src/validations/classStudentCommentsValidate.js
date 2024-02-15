const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const ClassStudentCommentsServices = require("../services/ClassStudentCommentsServices.js");
const AppError = require("../utils/appError.js");

exports.validate = async (data) => {
	const schemaObject = {
		classId: Joi.number().required(),
		studentId: Joi.number().required(),
		comment: Joi.string().required().min(1).max(1000),
	};

	const schema = Joi.object(schemaObject);

	const validatedData = await schema.validateAsync(data, validationOptions);

	await ClassStudentCommentsServices.checkStudentAndClassAndEnrollmentExists(
		validatedData
	);

	return validatedData;
};
