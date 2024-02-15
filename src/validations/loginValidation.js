const Joi = require("joi");
const AppError = require("../utils/appError");
const validationOptions = require("./utils/validationOptions.js");

exports.validate = async (data) => {
	const schema = Joi.object({
		email: Joi.string().required().email().max(64),
		password: Joi.string().required().min(8).max(64),
	});

	try {
		const validatedData = await schema.validateAsync(
			data,
			validationOptions
		);
		return validatedData;
	} catch (error) {
		if (!error.details)
			throw new AppError("Email or password is incorrect", 400);

		error.details = error.details.filter((e) => e.type === "any.required");

		if (error.details.length === 0)
			throw new AppError("Email or password is incorrect", 400);

		throw error;
	}
};
