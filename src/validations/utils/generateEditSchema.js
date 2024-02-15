const Joi = require("joi");

function generateEditSchema(schema, keys, mergeObject = {}) {
	const schemaObject = {};

	keys.forEach((e) => {
		schemaObject[e] = schema[e].optional();
	});

	Object.assign(schemaObject, mergeObject);

	return Joi.object(schemaObject);
}

module.exports = generateEditSchema;
