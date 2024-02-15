const router = require("express").Router();
const AuthController = require("../controllers/AuthController.js");
const StudentsController = require("../controllers/StudentsController.js");

router
	.route("/")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		StudentsController.getStudent
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		StudentsController.uploadPhoto,
		StudentsController.addStudent
	);

router
	.route("/:id")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		StudentsController.checkStudentInSchool,
		StudentsController.getStudentById
	)
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		StudentsController.checkStudentInSchool,
		StudentsController.deleteStudentById
	)
	.patch(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		StudentsController.checkStudentInSchool,
		StudentsController.uploadPhoto,
		StudentsController.editStudentById
	);

router
	.route("/nationalId/:national_id")
	.get(StudentsController.getStudentByNationalId);

module.exports = router;
