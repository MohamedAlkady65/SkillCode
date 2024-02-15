const Joi = require("joi");
const { phone } = require("phone");

module.exports = Joi.string().required().custom(checkPhone);

function checkPhone(value, helper) {
	const phoneValue = phone(value, {
		country: "",
	});

	if (!phoneValue.isValid) {
		return helper.message("phone number must be valid");
	}

	return phoneValue.phoneNumber;
}
