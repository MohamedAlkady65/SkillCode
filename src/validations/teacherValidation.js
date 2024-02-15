const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const generateEditSchema = require("./utils/generateEditSchema.js");
const phoneJoi = require("./utils/phoneJoi.js");
const {
	emailExists,
	teacherNationalIdExists,
	schoolExists,
} = require("./utils/checkExists.js");

exports.validate = async (data, edit = false) => {
	const schemaObject = {
		email: Joi.string()
			.required()
			.email()
			.min(8)
			.max(64)
			.external(emailExists),
		name: Joi.string().required().min(3).max(128),
		national_id: Joi.string()
			.required()
			.min(5)
			.max(28)
			.external(teacherNationalIdExists),
		gender: Joi.number().valid(1, 2).required(),
		phone: phoneJoi,
		school: Joi.number().external(schoolExists),
	};

	if (edit) {
		const editSchemaKeys = [
			"email",
			"name",
			"phone",
			"national_id",
			"gender",
			"school",
		];
		if ("photo" in data) {
			data.photo = data.photo == "null" ? null : data.photo;
		}
		const editSchema = generateEditSchema(schemaObject, editSchemaKeys, {
			photo: Joi.valid(null),
		});
		return await editSchema.validateAsync(data, validationOptions);
	}

	const schema = Joi.object(schemaObject);
	return await schema.validateAsync(data, validationOptions);
};
