const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const { sessionExists } = require("./utils/checkExists.js");

exports.validate = async (data) => {
	const schemaObject = {
		sessionId: Joi.number().required().external(sessionExists),
		description: Joi.string().required().min(5).max(2000),
	};

	const schema = Joi.object(schemaObject);

	return await schema.validateAsync(data, validationOptions);
};
