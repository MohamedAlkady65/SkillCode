const ClassesServices = require("../../services/ClassesServices");
const SchoolsServices = require("../../services/SchoolsServices");
const TeachersServices = require("../../services/TeachersServices");
const CoursesServices = require("../../services/CoursesServices");
const StudentsServices = require("../../services/StudentsServices");
const UsersServices = require("../../services/UsersServices");
const SessionsServices = require("../../services/SessionsServices");

exports.classExists = async (value, helper) => {
	if (!value) return;
	if (!(await ClassesServices.checkExists(value)))
		return helper.message("Class is not found");
};

exports.schoolExists = async (value, helper) => {
	if (!value) return;
	if (!(await SchoolsServices.checkExists(value)))
		return helper.message("School is not found");
};

exports.teachersExists = async (value, helper) => {
	if (!value) return;
	if (!(await TeachersServices.checkExists(value)))
		return helper.message("Teachers is not found");
};

exports.courseExists = async (value, helper) => {
	if (!value) return;
	if (!(await CoursesServices.checkExists(value)))
		return helper.message("Courses is not found");
};
exports.sessionExists = async (value, helper) => {
	if (!value) return;
	if (!(await SessionsServices.checkExists(value)))
		return helper.message("Session is not found");
};

exports.studentNationalIdExists = async (value, helper) => {
	if (!value) return;
	if (await StudentsServices.checkNationalIdExists(value))
		return helper.message("National Id is already exists");
};

exports.emailExists = async (value, helper) => {
	if (!value) return;
	if (await UsersServices.checkEmailExists(value))
		return helper.message("Email is already exists");
};
exports.teacherNationalIdExists = async (value, helper) => {
	if (!value) return;
	if (await TeachersServices.checkNationalIdExists(value))
		return helper.message("National Id is already exists");
};
