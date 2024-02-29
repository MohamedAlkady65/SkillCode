const router = require("express").Router();
const AuthController = require("../controllers/AuthController.js");
const StudentsController = require("../controllers/StudentsController.js");

router
	.route("/nationalId/:national_id")
	.get(StudentsController.getStudentByNationalId);

router.use(AuthController.protectRoute);

router
	.route("/")
	.all(AuthController.restrictTo(1, 2))
	.get(StudentsController.getAllStudents)
	.post(StudentsController.uploadPhoto, StudentsController.addStudent);

router
	.route("/:id")
	.all(
		AuthController.restrictTo(1, 2),
		StudentsController.checkStudentInSchool
	)
	.get(StudentsController.getStudentById)
	.delete(StudentsController.deleteStudentById)
	.patch(StudentsController.uploadPhoto, StudentsController.editStudentById);

module.exports = router;
