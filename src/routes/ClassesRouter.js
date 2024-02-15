const AuthController = require("../controllers/AuthController");
const ClassesController = require("../controllers/ClassesController");

const router = require("express").Router();

router
	.route("/")
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.add
	)
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.getAll
	);

router
	.route("/:id")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.checkClassInSchool,
		ClassesController.getById
	)
	.patch(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.checkClassInSchool,
		ClassesController.editById
	)
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.checkClassInSchool,
		ClassesController.deleteById
	);

router
	.route("/:id/students")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.checkClassInSchool,
		ClassesController.getEnrolledStudents
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.checkClassInSchool,
		ClassesController.enrollStudents
	)
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		ClassesController.checkClassInSchool,
		ClassesController.removeEnrolledStudents
	);

module.exports = router;
