const Joi = require("joi");
const validationOptions = require("./utils/validationOptions.js");
const generateEditSchema = require("./utils/generateEditSchema.js");
const TeachersServices = require("../services/TeachersServices.js");
const AppError = require("../utils/appError.js");
const ClassesServices = require("../services/ClassesServices.js");
const { schoolExists, courseExists, teachersExists } = require("./utils/checkExists.js");

validate = async (data, edit = false) => {
	const schemaObject = {
		school_id: Joi.number().required().external(schoolExists),
		course_id: Joi.number().required().external(courseExists),
		teacher_id: Joi.number().required().external(teachersExists),
		start_date: Joi.date().required(),
	};

	if (edit) {
		const editSchemaKeys = ["teacher_id", "start_date"];
		const editSchema = generateEditSchema(schemaObject, editSchemaKeys);
		return await editSchema.validateAsync(data, validationOptions);
	}

	const schema = Joi.object(schemaObject);

	return await schema.validateAsync(data, validationOptions);
};

exports.validate = validate;

exports.validateAndCheck = async (user, data, edit = false, classId = null) => {
	if (user.isSchool) {
		data.school_id = user.school_id;
	}

	const class_ = await validate(data, edit);

	if (edit) {
		class_.school_id = await ClassesServices.getSchoolOfClass(classId);
	}

	await checkIsRegisteredAtTheSchool(class_, user);

	return class_;
};

const checkIsRegisteredAtTheSchool = async (class_, user) => {
	if (!class_.teacher_id) return class_;

	const teacher = await TeachersServices.getTeacherById(class_.teacher_id);

	const teacherIsNotInSchoolError = new AppError(
		"Teacher is not registered at the school",
		400
	);
	const checkTeacherIsInSchoolUnlessIsInSkillCode = (_) => {
		if (teacher.school != null && teacher.school.id != class_.school_id)
			throw teacherIsNotInSchoolError;
	};
	const checkTeacherIsInSchool = (_) => {
		if (teacher.school == null || teacher.school.id != class_.school_id) {
			throw teacherIsNotInSchoolError;
		}
	};

	if (user.isAdmin) {
		checkTeacherIsInSchoolUnlessIsInSkillCode();
	} else if (user.isSchool) {
		checkTeacherIsInSchool();
	}
};

exports.validateEnrollStudents = async (data) => {
	const schemaObject = {
		class_id: Joi.number().required(),
		students: Joi.array().min(1).required().items(Joi.number()),
	};

	const schema = Joi.object(schemaObject);

	return await schema.validateAsync(data, validationOptions);
};

