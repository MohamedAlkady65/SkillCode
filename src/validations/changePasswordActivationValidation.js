const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const validationOptions = require("./utils/validationOptions.js");

const passwordOptions = {
	min: 8,
	max: 26,
	lowerCase: 1,
	upperCase: 1,
	numeric: 1,
	symbol: 1,
	requirementCount: 4,
};

exports.validate = async (data) => {
	const schema = Joi.object({
		password: passwordComplexity(passwordOptions).required(),
		passwordConfirm: Joi.string()
			.valid(Joi.ref("password"))
			.required()
			.messages({
				"any.only": "Passwords not match",
			}),
	});

	const validatedData = await schema.validateAsync(data, validationOptions);

	return validatedData.password;
};
