const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const { classExists } = require("./utils/checkExists.js");

exports.validate = async (data) => {
	const schemaObject = {
		classId: Joi.number().required().external(classExists),
        dateTime : Joi.date().required()
	};

	const schema = Joi.object(schemaObject);

	return await schema.validateAsync(data, validationOptions);
};
