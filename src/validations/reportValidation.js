const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const { classExists, studentExists } = require("./utils/checkExists.js");
const CoursesServices = require("../services/CoursesServices.js");
const ClassesServices = require("../services/ClassesServices.js");

exports.validate = async (data) => {
	const report = await validateReport(data);
	await validateAttributes(report);
	return report;
};

const validateReport = async (data) => {
	const schemaObject = {
		classId: Joi.number().required().external(classExists),
		studentId: Joi.number()
			.required()
			.external(studentExists)
			.external(async (value, helper) => {
				if (!data.classId || !data.studentId) return;
				if (
					!(await ClassesServices.checkStudentEnrolledInClass({
						classId: data.classId,
						studentId: data.studentId,
					}))
				)
					return helper.message(
						"Student is not enrolled in this class"
					);
			}),
		summary: Joi.string().max(2000),
		attributes: Joi.object().required(),
	};

	const schema = Joi.object(schemaObject);

	return await schema.validateAsync(data, validationOptions);
};

const validateAttributes = async (report) => {
	const attributes = await CoursesServices.getCourseAttributeByClassId(
		report.classId
	);

	const schemaObject = {};

	attributes.forEach((attr) => {
		schemaObject[attr["id"]] = Joi.number()
			.valid(1, 2, 3, 4, 5)
			.required()
			.messages({
				"any.required": `${attr.attribute} is a required field`,
				"any.only": `${attr.attribute} must be one of 1, 2, 3, 4, 5`,
			});
	});

	const schema = Joi.object(schemaObject);

	report.attributes = await schema.validateAsync(
		report.attributes,
		validationOptions
	);
};
