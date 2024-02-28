const AuthController = require("../controllers/AuthController");
const CoursesController = require("../controllers/CoursesController");

const router = require("express").Router();

router
	.route("/")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		CoursesController.getAllCourses
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1),
		CoursesController.addCourse
	);

router.get(
	"/list",
	AuthController.protectRoute,
	AuthController.restrictTo(1, 2),
	CoursesController.getListOfCourses
);

router
	.route("/:id")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		CoursesController.getCourseById
	)
	.patch(
		AuthController.protectRoute,
		AuthController.restrictTo(1),
		CoursesController.editCourseById
	)
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1),
		CoursesController.deleteCourseById
	);

module.exports = router;
