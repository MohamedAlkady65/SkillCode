const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const phoneJoi = require("./utils/phoneJoi.js");
const generateEditSchema = require("./utils/generateEditSchema.js");
const { emailExists } = require("./utils/checkExists.js");

exports.validate = async (data, edit = false) => {
	const schemaObject = {
		email: Joi.string()
			.required()
			.email()
			.min(8)
			.max(50)
			.external(emailExists),
		name: Joi.string().required().min(3).max(100),
		country: Joi.string().required().min(3).max(36),
		city: Joi.string().required().min(3).max(36),
		street: Joi.string().empty("").max(200),
		site: Joi.string().empty("").max(125),
		phone: phoneJoi,
		whatsapp_phone: phoneJoi.optional(),
		facebook: Joi.string().empty("").max(125),
		instagram: Joi.string().empty("").max(125),
		about: Joi.string().empty("").max(1000),
	};

	if (edit) {
		const editSchemaKeys = [
			"name",
			"country",
			"city",
			"street",
			"phone",
			"whatsapp_phone",
			"facebook",
			"instagram",
			"about",
		];
		if ("logo" in data) {
			data.logo = data.logo == "null" ? null : data.logo;
		}
		const editSchema = generateEditSchema(schemaObject, editSchemaKeys, {
			logo: Joi.valid(null),
		});

		return await editSchema.validateAsync(data, validationOptions);
	}

	const schema = Joi.object(schemaObject);
	return await schema.validateAsync(data, validationOptions);
};
