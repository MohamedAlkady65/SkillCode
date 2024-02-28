const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const generateEditSchema = require("./utils/generateEditSchema.js");

exports.validate = async (data, edit = false) => {
	const schemaObject = {
		title: Joi.string().required().min(2).max(100),
		description: Joi.string().max(1000),
		attributes: Joi.array()
			.min(1)
			.required()
			.items(Joi.string().min(2).max(20)),
	};

	if (edit) {
		const editSchemaKeys = ["title", "description"];
		const editSchema = generateEditSchema(schemaObject, editSchemaKeys);
		return await editSchema.validateAsync(data, validationOptions);
	}

	const schema = Joi.object(schemaObject);

	return await schema.validateAsync(data, validationOptions);
};
