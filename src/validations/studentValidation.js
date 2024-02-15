const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const generateEditSchema = require("./utils/generateEditSchema.js");
const {
	schoolExists,
	studentNationalIdExists,
} = require("./utils/checkExists.js");
const phoneJoi = require("./utils/phoneJoi.js");

exports.validate = async (data, edit = false) => {
	const schemaObject = {
		name: Joi.string().required().min(3).max(60),
		national_id: Joi.string()
			.required()
			.min(5)
			.max(28)
			.external(studentNationalIdExists),
		birth_day: Joi.date().required(),
		gender: Joi.number().valid(1, 2).required(),
		parent_phone: phoneJoi,
		school: Joi.number().required().external(schoolExists),
	};

	if (edit) {
		const editSchemaKeys = [
			"name",
			"birth_day",
			"national_id",
			"gender",
			"parent_phone",
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
